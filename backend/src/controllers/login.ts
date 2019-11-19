import bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import config = require('../utils/config')

const loginRouter = Router()

interface ILoginRequest extends Request {
    body: {
        username: string,
        password: string,
    }
}

export interface IUserToken extends Object {
    id: string,
    username: string
}

loginRouter.post('/', async (request: ILoginRequest, response: Response) => {

    const body = request.body

    const user = await User.findOne({ username: body.username })

    const passwordCorrect = user && await bcrypt.compare(body.password, user.passwordHash)

    if (!user || !passwordCorrect) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        id: user.id,
        username: user.username,
    }

    const token = jwt.sign(userForToken, config.JWT_SALT)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

export default loginRouter
