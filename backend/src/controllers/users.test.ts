import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import User, { IUser } from '../models/user'
import { MONGODB_URI, ROOT_PASSWORD, ROOT_USERNAME, TESTUSER_NAME, TESTUSER_PASSWORD, TESTUSER_USERNAME } from '../utils/config'
import { createRootUser, deleteAllUsers, randomPassword, randomUserName } from '../utils/userHelper'
import { IUserChanges } from './users'

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
      name: TESTUSER_NAME,
      password: TESTUSER_PASSWORD,
      username: TESTUSER_USERNAME
    }

    await api
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(customUser)
      .expect(201)

    expect(await User.find({ username: customUser.username })).toHaveLength(1)
  })
  test('/api/users POST is validated', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const tooShortUserame = 'sho'
    const tooLongUsername = 'thisusernameiswaytoolongtobeusebecausethisisoversixtyfourcharacters'
    const usernameWithSpaces = 'User name'
    const usernameWithForbiddenChar = 'username!'
    const invalidUsernames = [
      tooShortUserame,
      tooLongUsername,
      usernameWithSpaces,
      usernameWithForbiddenChar,
    ]

    invalidUsernames.forEach(async (invalidUsername: string) => {
      const invalidUser = {
        name: 'no name',
        password: randomPassword(10),
        username: invalidUsername
      }

      await api
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send(invalidUser)
        .expect(400)
    })

    const passwordWithSpaces = 'pass word'
    const passwordWithForbiddenChars = '{password}'
    const tooShortPassword = 'passwor'
    const tooLongPassword = 'passwordIsTooLongOver64lettersspasswordIsTooLongOver64lettersshere'
    const invalidPasswords = [passwordWithSpaces, passwordWithForbiddenChars, tooShortPassword, tooLongPassword]

    invalidPasswords.forEach(async (invalidPassword: string) => {
      const invalidUser = {
        name: 'no name',
        password: invalidPassword,
        username: randomUserName()
      }

      await api
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .set('Authorization', token)
        .send(invalidUser)
        .expect(400)
    })
  })

})

describe('/api/users/owner POST', () => {
  test('new random user is owned by root_user', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const randomUser = (await User.find({}))[1]

    const response: any = await api
      .post('/api/users/owner')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({ id: randomUser._id + '' })
      .expect(200)

    const owner = response.body

    const realOwner = await User.findOne({})

    expect(realOwner.username).toBe(owner.username)
  })
})

describe('/api/users/owner POST', () => {
  test('new random user is owned by root_user', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const randomUser = (await User.find({}))[1]

    const response: any = await api
      .post('/api/users/owner')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({ id: randomUser._id + '' })
      .expect(200)

    const owner = response.body

    const realOwner = await User.findOne({})

    expect(realOwner.username).toBe(owner.username)
  })
})

describe('/api/users PUT', () => {
  test('random user can be changed by root_user', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const customUser = {
      name: 'not modified name',
      password: 'secretpassword',
      username: 'notmodifiedusername'
    }

    const beforeUser = (await api
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(customUser)
      .expect(201)).body

    const changes: IUserChanges = {
      changes: {
        name: 'modified name',
        username: 'modifiedusername'
      },
      id: beforeUser.id
    }

    await api
      .put('/api/users')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(changes)
      .expect(200)

    const after = await User.findOne({ _id: beforeUser.id })

    expect(beforeUser.username).not.toBe(after.username)
    expect(beforeUser.name).not.toBe(after.name)

    expect(after.username).toBe(changes.changes.username)
    expect(after.name).toBe(changes.changes.name)
  })
})

describe('/api/users DELETE', () => {
  test('root_user can remove user', async () => {

    const token = 'bearer ' + rootLogin.body.token

    const saltRounds = 10
    const passwordHash = await bcrypt.hash('password122', saltRounds)

    const owner = await User.findOne({ username: ROOT_USERNAME })

    const userForDelete = new User({
      created: new Date(),
      name: 'Deletable User',
      owner,
      passwordHash,
      username: 'deletemeee',
    })

    const savedUser = await userForDelete.save()

    expect(await User.find({ username: 'deletemeee' })).toHaveLength(1)

    await api
      .delete('/api/users/' + savedUser.id)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(204)

    expect(await User.find({ username: 'deletemeee' })).toHaveLength(0)
  })
  test('user can remove children', async () => {
    const token = 'bearer' + rootLogin.body.token

    const saltRounds = 10
    const passwordHash = await bcrypt.hash('password544', saltRounds)
    const childPasswordHash = await bcrypt.hash('password545', saltRounds)

    const owner = await User.findOne({ username: ROOT_USERNAME })

    const parent = new User({
      created: new Date(),
      name: 'User with children',
      owner,
      passwordHash,
      username: 'ihavechildren'
    })
    const savedParent = await parent.save()

    const child = new User({
      created: new Date(),
      name: 'User with children',
      owner: savedParent,
      passwordHash: childPasswordHash,
      username: 'ihaveparent',
    })
    const savedChild = await child.save()

    const parentLogin = await api
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send({ username: 'ihavechildren', password: 'password544' })
      .expect(200)
    const parentToken = 'bearer ' + parentLogin.body.token

    await api
      .delete('/api/users/' + savedChild.id)
      .set('Content-Type', 'application/json')
      .set('Authorization', parentToken)
      .expect(204)
  })
})

describe('/api/users GET', () => {
  test('user does not see his siblings', async () => {

    const saltRounds = 10

    const owner = await User.findOne({ username: ROOT_USERNAME })

    const userPassword = randomPassword(12)
    const user = new User({
      created: new Date(),
      name: 'Luke Skywalker',
      owner,
      passwordHash: await bcrypt.hash(userPassword, saltRounds),
      username: 'curious',
    })
    await user.save()

    const sibling = new User({
      created: new Date(),
      name: 'Princess Leia',
      owner,
      passwordHash: await bcrypt.hash(randomPassword(12), saltRounds),
      username: 'secretsibling',
    })
    await sibling.save()

    const userLogin = await api
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send({ username: user.username, password: userPassword })

    const userToken = 'bearer ' + userLogin.body.token

    const users = await api
      .get('/api/users/')
      .set('Content-Type', 'application/json')
      .set('Authorization', userToken)
      .expect(200)

    const visibleUsers: IUser[] = users.body
    const siblingInfo = visibleUsers.find((u: IUser) => u.username === sibling.username)
    expect(siblingInfo).toBeUndefined()
  })
})

describe('/api/users GET', () => {
  test('admin sees everybody', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const allUsers = await User.find({})
    const users = await api
      .get('/api/users/')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)

    expect(users.body).toHaveLength(allUsers.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
