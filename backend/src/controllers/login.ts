import Joi from '@hapi/joi'
import bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import config = require('../utils/config')
import { LoginRequestSchema, validationErrorSend } from '../utils/validators'

const loginRouter = Router()

interface IIncorrectLogin {
    usernameBeginning: string,
    cooldownIterator: number,
    expires: Date
}

const incorrectLogins: IIncorrectLogin[] = []
const usernameDetail = 4
const initialCooldown = 4

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

export interface IJoiError extends Joi.ValidationError {
    isJoi: boolean,
    details: [{
        message: string,
        path: string[],
        type: string,
        context: object
    }],
    _object: {
        username: string,
        password: string,
    }
}

loginRouter.post('/', async (request: ILoginRequest, response: Response) => {
    const body = request.body
    const validationResult = LoginRequestSchema.validate(body)

    if (!validationErrorSend(response, validationResult)) {
        const index = incorrectLogins.findIndex((login: IIncorrectLogin) =>
            login.usernameBeginning === body.username.substr(0, usernameDetail))
        if (index > -1 && incorrectLogins[index].expires.valueOf() > Date.now().valueOf()) {
            return response.status(429).send({
                cooldownEnd: incorrectLogins[index].expires.valueOf() - Date.now().valueOf(),
                error: 'Resubmitting automatically after cooldown',
            }).end()
        }

        const user = await User.findOne({ username: body.username })

        const passwordCorrect = user ? // always await for bcrypt even if user is not correct
            await bcrypt.compare(body.password, user.passwordHash) :
            await bcrypt.hash(body.password, 10)

        if (!user || !passwordCorrect) {
            if (index === -1) {
                const incorrectLogin: IIncorrectLogin = {
                    cooldownIterator: initialCooldown,
                    expires: new Date(Date.now() + 1000 * initialCooldown),
                    usernameBeginning: body.username.substr(0, usernameDetail),
                }
                incorrectLogins.unshift(incorrectLogin)
            } else {
                const incorrectLogin: IIncorrectLogin = incorrectLogins.splice(index)[0]
                const updatedIncorrectLogin = {
                    cooldownIterator: incorrectLogin.cooldownIterator * 2,
                    expires: new Date(Date.now() + 1000 * incorrectLogin.cooldownIterator * 2),
                    usernameBeginning: incorrectLogin.usernameBeginning,
                }
                incorrectLogins.unshift(updatedIncorrectLogin)
            }

            return response.status(401).send({
                error: 'Invalid username or password',
            }).end()
        }

        // TODO: clean trash from incorrectLogins
        if (index > -1 && incorrectLogins[index].expires.valueOf() < Date.now().valueOf()) {
            incorrectLogins.splice(index)
        }

        const userForToken: IUserToken = {
            id: user.id,
            username: user.username,
        }

        const token = jwt.sign(userForToken, config.JWT_SALT)

        const responseData = { token, username: user.username, name: user.name }

        return response
            .status(200)
            .send(responseData)
    }
})

export default loginRouter
