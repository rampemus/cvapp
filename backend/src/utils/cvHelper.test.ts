import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import { MONGODB_URI, ROOT_NAME, ROOT_PASSWORD, ROOT_USERNAME } from './config'
import { deleteAllCVObjects, deleteAllCVs, generateTestCV } from './cvHelper'

const api = supertest(app)

beforeAll(async () => {
    mongoose.set('useCreateIndex', true)
    mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

    await deleteAllCVs()
    await deleteAllCVObjects()
})

test('connectObjectToCVField', async () => {
        // TODO: empty test

})

test('disconnectObjectFromCVField', async () => {
        // TODO: empty test

})

test('generateTestCV with username root_user', async () => {
        // TODO: empty test

})

test('userIsCVOwner', async () => {
        // TODO: empty test

})

test('deleteAllCVs', () => {
        // TODO: empty test

})

test('deleteAllCVObjects', () => {
        // TODO: empty test

})

afterAll(() => {
    mongoose.connection.close()
})
