import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { IUserToken } from '../controllers/login'
import { JWT_SALT, ROOT_USERNAME } from './config'


interface IRequestWithToken extends Request {
    token: string,
}

interface IRequestWithIdentity extends IRequestWithToken {
    userGroup: string,
}

const getTokenFrom = ( request: IRequestWithToken ) => {
    const authorization = request.get('authorization')
    const schema = 'bearer'
    if (authorization && authorization.toLowerCase().startsWith(schema + ' ')) {
        return authorization.substring(schema.length + 1)
    }
    return null
}

const TokenExtractor = ( request: IRequestWithToken, response: Response, next: any) => {
    request.token = getTokenFrom(request)
    next()
}

const AuthenticateUser = (request: IRequestWithIdentity, response: Response, next: any) => {
    const token = request.token

    // TODO: need some help to fix this jwt typescript weirdo thingy
    const decodedToken: any = jwt.verify(token, JWT_SALT)

    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid'}).end()
    }

    request.userGroup = decodedToken.username === ROOT_USERNAME ? 'admin' : 'user'

    next()
}

const RequestLogger = (request: IRequestWithIdentity, response: Response, next: any ) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    // console.log('Header: ', request.headers)
    console.log('Body:  ', request.body)
    console.log('Token: ', request.token)
    console.log('User: ', request.userGroup)
    console.log('---')
    next()
}

// TODO: private and public routes
// make a file having routes
// divide routers into two 
// TODO: create admin route
// TODO: create user routes

export {
    AuthenticateUser,
    RequestLogger,
    TokenExtractor
}
