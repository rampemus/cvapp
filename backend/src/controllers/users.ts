import bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import CurriculumVitae from '../models/cv/cv'
import User from '../models/user'
import { ROOT_USERNAME } from '../utils/config'
import { IRequestWithIdentity } from '../utils/middleware'
import {
    ownerId,
    randomPassword,
    randomUserName,
    userIsRootUser
} from '../utils/userHelper'
import { NewUserRequestSchema, objectId, validationErrorSend } from '../utils/validators'

const usersRouter = Router()

usersRouter.get('/', async (request: Request, response: Response) => {
    const users = await User.find({})
    response.json(users)
})

// TODO: write test for POST /owner
usersRouter.post('/owner', async (request: IRequestWithIdentity, response: Response) => {
    const id: string = request.body.id
    validationErrorSend(response, objectId.validate(id))

    const user = await User.findOne({ _id: id })
    if (user.username === ROOT_USERNAME) {
        return response.status(200).json(user).end()
    }
    const owner = await User.findOne({ _id: user.owner + '' })

    return response.status(200).json(owner).end()
})

interface INewUserBody {
    name: string,
    username: string,
    password: string,
    expires: Date | null
}

usersRouter.post('/', async (request: IRequestWithIdentity, response: Response) => {

    const makeRandomUser = !request.body.name && !request.body.username && !request.body.password

    const body: INewUserBody = makeRandomUser ? {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // valid for a month
        name: 'noname',
        password: randomPassword(10),
        username: randomUserName(),
    } : request.body

    const validationResult = NewUserRequestSchema.validate(body)
    if (!validationErrorSend(response, validationResult)) {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const owner = await User.findOne({ _id: request.userid })

        if (!owner) {
            response.status(404).json({ error: 'Invalid token' }).end()
        }

        let expires = null // prevent created user to live longer than it's owner
        if (owner.expires && body.expires) {
            expires = ( owner.expires > body.expires ) ? body.expires : owner.expires
        } else {
            expires = owner.expires ? owner.expires : body.expires
        }

        const user = new User({
            created: new Date(),
            expires,
            name: body.name,
            owner,
            passwordHash,
            username: body.username,
        })

        const savedUser = await user.save()
            .catch((error) => {
                const errorResponse = error.message
                return response.status(400).json({
                    error: errorResponse
                }).end()
            })

        if (savedUser) {
            await CurriculumVitae.updateOne({ default: owner._id }, { $push: { default: savedUser } })

            return response.status(201).json(makeRandomUser ? {
                created: user.created,
                name: user.name,
                password: body.password,
                username: user.username,
            } : savedUser).end()
        }
    }
})

interface IUserChanges {
    id: string,
    changes: {
        name?: string,
        username?: string,
        password: string,
        newPassword?: string,
        expires?: Date | null
    }
}

// TODO: write test for POST PUT /
usersRouter.put('/', async (request: IRequestWithIdentity, response: Response) => {
    const id = request.body.id

    console.log('users/put id', id)

    const body: IUserChanges['changes'] = request.body.changes

    const user = await User.findOne({ _id: id }).populate('owner')

    console.log('users/put user', user)

    if (!(
        request.userGroup === 'admin'
        || id === user._id + ''
        || request.username === user.owner.username
    )) {
        return response.status(401).send({
            error: 'Admin authorization needed'
        }).end()
    }

    if (body.expires !== undefined && request.userGroup !== 'admin') {
        return response.status(401).send({
            error: 'Admin authorization needed for changing expire date'
        }).end()
    }

    const passwordCorrect = !body.newPassword || user
        ? await bcrypt.compare(body.password, user.passwordHash)
        : await bcrypt.hash(body.password + '', 10)

    if (user && !passwordCorrect) {
        return response.status(401).send({
            error: 'Invalid old password',
        }).end()
    }

    console.log('writing database: _id:', user._id, ' changes: ', body)
    const updatedUser = await User.findOneAndUpdate({ _id: user._id }, body)
        .catch((error)=> console.log('error: ', error))
    console.log('users put success: ', updatedUser)
    response.status(201).json(updatedUser)
})

usersRouter.delete('/:id', async (request: IRequestWithIdentity, response: Response ) => {

    const userHasPermission = request.userGroup === 'admin'     // allowed to admin
        || request.userid === request.params.id                 // allowed to delete themselves
        || await ownerId(request.params.id) === request.userid  // allowed to delete children
    if (!userHasPermission) {
        return response.status(401).json({ error: 'Authorization error: Admin permissions needed' }).end()
    }

    if (await userIsRootUser(request.params.id)) { // Impossible to remove root_user
        return response.status(400).json({ error: 'Root user cannot be deleted' }).end()
    }

    try {

        if (!await User.exists({ _id: request.params.id })) {
            response.status(404).json({ error: 'User does not exist' }).end()
        }

        // TODO: find user references and delete them
        await CurriculumVitae.updateMany({ default: request.params.id }, { $pull: { default: request.params.id } })

        await User.deleteOne({ _id: request.params.id })

        return response.status(204).end()
    } catch (error) {
        return response.status(400).json({ error: error.message })
    }
})

export default usersRouter
