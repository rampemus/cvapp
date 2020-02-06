import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import { ROOT_NAME, ROOT_PASSWORD, ROOT_USERNAME } from '../utils/config'
import { createRootUser, userExists } from '../utils/userHelper'

const api = supertest(app)

beforeAll(async () => {
    const rootExists = await userExists(ROOT_USERNAME)
    if (!rootExists) {
        await createRootUser()
    }
})

test('root_user exists', async () => {
    expect(await userExists(ROOT_USERNAME)).toBe(true)
})

test('Login success with root_user', async () => {
    const rootLogin = await api
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({ username: ROOT_USERNAME, password: ROOT_PASSWORD })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(rootLogin.body.token).toHaveLength(177)

    expect(rootLogin.body.username).toBe(ROOT_USERNAME)

    expect(rootLogin.body.name).toBe(ROOT_NAME)
})

afterAll(() => {
    mongoose.connection.close()
})
