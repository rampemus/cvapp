import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import { MONGODB_URI, ROOT_NAME, ROOT_PASSWORD, ROOT_USERNAME } from '../utils/config'
import { createRootUser, deleteAllUsers, randomPassword, randomUserName, userExists } from '../utils/userHelper'

const api = supertest(app)

beforeAll(async () => {
    mongoose.set('useCreateIndex', true)
    mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

    await deleteAllUsers()
    await createRootUser()
})

test('root_user exists', async () => {
    expect(await userExists(ROOT_USERNAME)).toBe(true)
})

test('/api/login POST success with root_user', async () => {
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

const repeat = 5

describe('Incorrect credentials', () => {
    test('/api/login POST fails with wrong password', async () => {
        for (let i = 0; i < repeat; i++) {
            await api
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send({ username: ROOT_USERNAME, password: randomPassword(ROOT_PASSWORD.length) })
                .expect(401)
        }
    })
    test('/api/login POST fails with wrong username', async () => {
        for (let i = 0; i < repeat; i++) {
            await api
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send({ username: randomUserName(), password: ROOT_PASSWORD })
                .expect(401)
        }
    })
    test('/api/login POST fails with wrong username and password', async () => {
        for (let i = 0; i < repeat; i++) {
            await api
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send({ username: randomUserName(), password: randomPassword(ROOT_PASSWORD.length) })
                .expect(401)
        }
    })
})

afterAll(() => {
    mongoose.connection.close()
})
