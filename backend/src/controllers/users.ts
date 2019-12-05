import bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import User from '../models/user'
import { IRequestWithIdentity } from '../utils/middleware'

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

    if (request.userGroup !== 'admin') {
        return response.status(401).json({ error: 'Authorization error: Admin permissions needed' }).end()
    }

    const body: INewUserBody = await request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = await new User({
        name: body.name,
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
    if (request.userGroup !== 'admin') {
        return response.status(401).json({ error: 'Authorization error: Admin permissions needed' }).end()
    }

    try {
        // TODO: find user references and delete them
        // Delete blog from data
        await User.deleteOne({ _id: request.params.id })

        response.status(204).end()
    } catch (error) {
        // console.log(`response.status(400).json({ error: ${error.message} })`)
        response.status(400).json({ error: error.message })
    }
})

export default usersRouter
