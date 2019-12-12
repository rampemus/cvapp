import bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import User from '../models/user'
import { IRequestWithIdentity } from '../utils/middleware'
import {
    getUserById,
    ownerId,
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
}

usersRouter.post('/', async (request: IRequestWithIdentity, response: Response) => {

    const body: INewUserBody = await request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    if (!await User.exists({ _id: request.userid })) {
        response.status(404).json({ error: 'Invalid token' }).end()
    }

    const user = await new User({
        created: new Date(),
        name: body.name,
        owner: await User.findOne({ _id: request.userid }),
        passwordHash,
        username: body.username,
    })

    const savedUser = await user.save()
        .catch((error) => {
            response.status(400).json({ error: error.message }).end()
        })

    response.status(201).json(savedUser).end()
})

usersRouter.delete('/:id', async (request: IRequestWithIdentity, response: Response ) => {
    // TODO: enable users to delete themselves
    // TODO: enable users to delete their children
    // TODO: prevent rootuser deletion
    const userHasPermission = request.userGroup === 'admin'
        || request.userid === request.params.id
        || await ownerId(request.params.id) === request.userid
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
        await User.deleteOne({ _id: request.params.id })

        response.status(204).end()
    } catch (error) {
        response.status(400).json({ error: error.message })
    }
})

export default usersRouter
