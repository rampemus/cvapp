import bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import Joi from 'joi'
import CurriculumVitae from '../models/cv/cv'
import User from '../models/user'
import { IRequestWithIdentity } from '../utils/middleware'
import {
    ownerId,
    randomPassword,
    randomUserName,
    userIsRootUser,
} from '../utils/userHelper'
import { IJoiError } from './login'

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

const NewUserRequestSchema = Joi.object().keys({
    expires: Joi.date(),
    name: Joi.string().regex(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]*$/).min(2).max(100).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9!#%&]*$/).min(8).max(64).required(),
    username: Joi.string().alphanum().min(4).max(30).required(),
})

usersRouter.post('/', async (request: IRequestWithIdentity, response: Response) => {

    const makeRandomUser = !request.body.name && !request.body.username && !request.body.password

    const body: INewUserBody = makeRandomUser ? {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // valid for a month
        name: 'noname',
        password: randomPassword(10),
        username: randomUserName(),
    } : request.body

    Joi.validate(body, NewUserRequestSchema, (error: IJoiError) => {
        if (error) {
            response.status(400).send({
                error: error.details[0].path[0] === 'password' && error.details[0].message.search(/regex/) > -1
                    ? 'Password can only hold characters that are numbers, letters special characters such as !, #, % or &'
                    : error.details[0].path[0] === 'name' && error.details[0].message.search(/regex/) > -1
                    ? 'Name has forbidden special characters'
                    : error.details[0].message
            }).end()
        }
    })

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
            response.status(400).json({
                error: error.message.search(/expected `username` to be unique./) > -1
                ? 'Username ' + body.username + ' is already taken'
                : error.message
            }).end()
        })

    await CurriculumVitae.updateOne({ default: owner.id }, { $push: { default: savedUser } })

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

        response.status(204).end()
    } catch (error) {
        response.status(400).json({ error: error.message })
    }
})

export default usersRouter
