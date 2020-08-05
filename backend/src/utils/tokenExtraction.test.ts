import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import { MONGODB_URI, ROOT_PASSWORD, ROOT_USERNAME } from './config'
import { AuthenticateUser, getTokenFrom, TokenExtractor } from './middleware'
import { createRootUser, deleteAllUsers } from './userHelper'

const api = supertest(app)

let rootLogin: any = null

beforeAll(async () => {
  mongoose.set('useCreateIndex', true)
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

  await deleteAllUsers()
  await createRootUser()

  rootLogin = await api
    .post('/api/login')
    .set('Content-Type', 'application/json')
    .send({ username: ROOT_USERNAME, password: ROOT_PASSWORD })
})

const mockedExtractToken = getTokenFrom as jest.Mock<any>
const mockedTokenExtractor = TokenExtractor as jest.Mock<any>
const mockedAuthenticateUser = AuthenticateUser as jest.Mock<any>

describe('/api/users GET', () => {
  test('Token will be extracted', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const jsonResult = { end: jest.fn() }
    const statusResult = {
      json: (body: object) => jsonResult
    }
    const response = { status: (statusCode: number) => statusResult }

    const request = { get: (par: string) => token }

    expect(await mockedExtractToken(request)).toBe(token.substring(7))

    const next = jest.fn()

    await mockedTokenExtractor(request, response, next)
    expect(next).toBeCalled()

    mockedAuthenticateUser(request, response, next)

    await new Promise((r) => setTimeout(r, 200))
    expect(next).toBeCalledTimes(2)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
