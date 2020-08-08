import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { IUserToken } from '../controllers/login'
import { JWT_SALT, ROOT_USERNAME } from './config'
import { getUserByUsername } from './userHelper'

export interface IRequestWithToken extends Request {
  token: string,
}

export interface IRequestWithIdentity extends IRequestWithToken {
  userGroup: string,
  username: string,
  userid: string
}

export const getTokenFrom = (request: IRequestWithToken) => {
  const authorization = request.get('authorization')
  const schema = 'bearer'
  if (authorization && authorization.toLowerCase().startsWith(schema + ' ')) {
    return authorization.substring(schema.length + 1)
  }
  return null
}

const TokenExtractor = (request: IRequestWithToken, response: Response, next: any) => {
  request.token = getTokenFrom(request)
  next()
}

const AuthenticateUser = async (request: IRequestWithIdentity, response: Response, next: any) => {
  const token = request.token

  const decodedToken: IUserToken = jwt.verify(token, JWT_SALT)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' }).end()
  }

  getUserByUsername(decodedToken.username).then((result) => {
    if (result.id === decodedToken.id) {
      request.userGroup = decodedToken.username === ROOT_USERNAME ? 'admin' : 'user'
      request.username = decodedToken.username
      request.userid = decodedToken.id
    } else {
      return response.status(401).json({ error: 'token missing or invalid' }).end()
    }
    next()
  }).catch((error) => response.status(401).json({ error: 'token missing or invalid' }).end())
}

const RequestLogger = (request: IRequestWithIdentity, response: Response, next: any) => {
  // console.log('Method:', request.method)
  // console.log('Path:  ', request.path)
  // console.log('Header: ', request.headers)
  // console.log('Request::', request)
  // console.log('Body:  ', request.body)
  // console.log('Token: ', request.token)
  console.log('User: ', request.userGroup)
  // console.log('---')
  next()
}

export {
  AuthenticateUser,
  RequestLogger,
  TokenExtractor
}
