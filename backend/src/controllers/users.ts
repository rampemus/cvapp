import bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import CurriculumVitae from '../models/cv/cv'
import User from '../models/user'
import { IRequestWithIdentity } from '../utils/middleware'
import {
    ownerId,
    randomPassword,
    randomUserName,
    userIsRootUser,
} from '../utils/userHelper'

const usersRouter = Router()

usersRouter.get('/', async (request: Request, response: Response) => {
    const users = await User.find({})
    response.json(users)
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
        name: 'noname',
        password: randomPassword(),
        username: randomUserName(),
    } : request.body
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
            response.status(400).json({ error: error.message }).end()
        })

    await CurriculumVitae.update({ default: owner.id }, { $push: { default: savedUser } })

    response.status(201).json(makeRandomUser ? {
        created: user.created,
        name: user.name,
        password: body.password,
        username: user.username,
    } : savedUser).end()
})

usersRouter.delete('/:id', async (request: IRequestWithIdentity, response: Response ) => {

    const userHasPermission = request.userGroup === 'admin'     // allowed to admin
        || request.userid === request.params.id                 // allowed to delete themselves
        || await ownerId(request.params.id) === request.userid  // allowed to delete children
    if (!userHasPermission) {
        return response.status(401).json({ error: 'Authorization error: Admin permissions needed' }).end()
    }

    if (await userIsRootUser(request.params.id)) { // Tokens will be not trusted
        return response.status(400).json({ error: 'Root user cannot be deleted' }).end()
    }

    try {

        if (!await User.exists({ _id: request.params.id })) {
            response.status(404).json({ error: 'User does not exist' }).end()
        }

        // TODO: find user references and delete them
        await CurriculumVitae.update({ default: request.params.id }, { $pull: { default: request.params.id } })

        await User.deleteOne({ _id: request.params.id })

        response.status(204).end()
    } catch (error) {
        response.status(400).json({ error: error.message })
    }
})

export default usersRouter
