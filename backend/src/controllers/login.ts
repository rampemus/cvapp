import bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import config = require('../utils/config')

const loginRouter = Router()

interface IIncorrectLogin {
    usernameBeginning: string,
    cooldownIterator: number,
    expires: Date
}

const incorrectLogins: IIncorrectLogin[] = [] // TODO: replace with hash table
const usernameDetail = 4
const initialCooldown = 4

interface ILoginRequest extends Request {
    body: {
        username: string,
        password: string,
    }
}

const LoginRequestSchema = Joi.object().keys({
    password: Joi.string().regex(/^[a-zA-Z0-9!#%&]{8,64}$/),
    username: Joi.string().alphanum().min(4).max(30).required()
})

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

    Joi.validate(body, LoginRequestSchema, (error: IJoiError) => {
        if (error) {
            response.status(401).send({
                error: error.details[0].path[0] === 'password' && error.details[0].message.search(/password/) > -1
                ? 'Invalid username or password'
                : error.details[0].message
            }).end()
        }
    })

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

    response
        .status(200)
        .send(responseData)
})

export default loginRouter
