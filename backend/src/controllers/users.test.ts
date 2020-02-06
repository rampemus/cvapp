import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import User from '../models/user'
import { MONGODB_URI, ROOT_PASSWORD, ROOT_USERNAME, TESTUSER1_NAME, TESTUSER1_PASSWORD, TESTUSER1_USERNAME } from '../utils/config'
import { createRootUser, deleteAllUsers } from '../utils/userHelper'

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

describe('/api/users GET', () => {
    test('success with root_user', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const users = await api
        .get('/api/users')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .expect(200)

        expect(users.body).toHaveLength(await (await (User.find({}))).length)
    })
})

describe('/api/users POST', () => {
    test('new random user success with root_user', async () => {

        const token = 'bearer ' + rootLogin.body.token

        const users = await api
            .post('/api/users')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(201)

        expect(await User.find({ username: users.body.username })).toHaveLength(1)
    })

    test('new custom user success with root_user', async () => {

        const token = 'bearer ' + rootLogin.body.token

        const customUser = {
            name: TESTUSER1_NAME,
            password: TESTUSER1_PASSWORD,
            username: TESTUSER1_USERNAME
        }

        await api
            .post('/api/users')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(customUser)
            .expect(201)

        expect(await User.find({ username: customUser.username })).toHaveLength(1)
    })
})

describe('/api/users DELETE', () => {
    test('root_user can remove user', async () => {

        const token = 'bearer ' + rootLogin.body.token

        const saltRounds = 10
        const passwordHash = await bcrypt.hash('password', saltRounds)

        const userForDelete = new User({
            created: new Date(),
            name: 'Deletable User',
            owner: await User.findOne({ username: ROOT_USERNAME }),
            passwordHash,
            username: 'deleteme',
        })

        const savedUser = await userForDelete.save()

        expect(await User.find({ username: 'deleteme' })).toHaveLength(1)

        await api
            .delete('/api/users/' + savedUser.id)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(204)

        expect(await User.find({ username: 'deleteme' })).toHaveLength(0)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
