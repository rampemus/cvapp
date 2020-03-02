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

const repeat = 1

let start1 = new Date()
let start2 = new Date()
let end1 = new Date()
let end2 = new Date()

describe('Incorrect credentials', () => {
    test('/api/login POST fails with wrong username', async () => {
        // for (let i = 0; i < repeat; i++) {
            await api
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send({ username: randomUserName(), password: ROOT_PASSWORD })
                .expect(401)
        // }
    })
    test('/api/login POST fails with wrong password', async () => {
        start1 = new Date()
        for (let i = 0; i < repeat; i++) {
            await api
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send({ username: ROOT_USERNAME, password: randomPassword(ROOT_PASSWORD.length) })
                .expect(401)
        }
        end1 = new Date()
    })
    test('/api/login POST fails with wrong username and password', async () => {
        const randomUsernames = []
        const randomPasswords = []
        for (let i = 0; i < repeat; i++) {
            randomUsernames.push(randomUserName().substr(0, ROOT_USERNAME.length))
            randomPasswords.push(randomPassword(ROOT_PASSWORD.length))
        }
        start2 = new Date()
        for (let i = 0; i < repeat; i++) {
            await api
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send({ username: randomUsernames[i], password: randomPasswords[i] })
                .expect(401)
        }
        end2 = new Date()
    })
    test('Timed attack against username', async () => {
        const time1 = end1.valueOf() - start1.valueOf()
        const time2 = end2.valueOf() - start2.valueOf()
        expect(time2 - time1).toBeLessThan(repeat * 10)
        expect(time1 - time2).toBeLessThan(repeat * 10)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
