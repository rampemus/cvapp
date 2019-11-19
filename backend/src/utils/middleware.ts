import { Request, Response } from 'express'
interface IAnyRequest {
    method: string,
    path: string,
    body: any
}

// TODO: ***use express interfaces instead of own ones

interface IRequestWithToken extends Request {
    token: string,
}

const getTokenFrom = ( request: IRequestWithToken ) => {
    const authorization = request.get('authorization')
    const schema = 'bearer'
    if (authorization && authorization.toLowerCase().startsWith(schema + ' ')) {
        return authorization.substring(schema.length + 1)
    }
    return null
}

const requestLogger = ( request: IAnyRequest, response: Response, next: any ) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    // console.log('Header: ', request.headers)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const tokenExtractor = ( request: IRequestWithToken, response: any, next: any) => {
    request.token = getTokenFrom(request)
    next()
}

// TODO: private and public routes
// make a file having routes
// divide routers into two 
// TODO: create admin route
// TODO: create user routes

exports = {
    requestLogger,
    tokenExtractor
}
