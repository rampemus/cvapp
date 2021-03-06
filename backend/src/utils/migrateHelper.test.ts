import mongodb from 'mongodb'
import mongoose from 'mongoose'
import User from '../models/user'
import { MONGODB_URI } from './config'
import {
  deleteAllCVObjects,
  deleteAllCVs,
} from './cvHelper'
import {
  migrateExperienceDescriptionsToContent,
  migrateProjectDescriptionsToContent
} from './migrateHelper'

beforeAll(async () => {
  mongoose.set('useCreateIndex', true)
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

  await deleteAllCVs()
  await deleteAllCVObjects()

})

describe('Migrate old descriptions', () => {
  test('from old experiences', async () => {
    const db = await mongodb.MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })

    const oldTypeExperience = {
      description: 'Old type description',
      name: 'Old experience',
      owner: await (await User.findOne({}))._id,
      timeFrame: {
        endDate: new Date(),
        startDate: new Date()
      }
    }

    const before = await db.db().collection('experiences').insertOne(oldTypeExperience)
    expect(before.result.n).toBe(1)
    expect(before.result.ok).toBe(1)

    await migrateExperienceDescriptionsToContent()

    const after = await db.db().collection('experiences').findOne({ name: oldTypeExperience.name })

    expect(after.content[0]).toBe(oldTypeExperience.description)

    db.close()
  })

  test('from old projects', async () => {
    const db = await mongodb.MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })

    const oldTypeProject = {
      description: 'Old description',
      githubUrl: 'some github url',
      name: 'Old project',
      owner: await (await User.findOne({}))._id,
      showcaseUrl: 'some url to some showcase',
      thumbnailUrl: 'some url to some thumbnail',
    }

    const before = await db.db().collection('projects').insertOne(oldTypeProject)
    expect(before.result.n).toBe(1)
    expect(before.result.ok).toBe(1)

    await migrateProjectDescriptionsToContent()

    const after = await db.db().collection('projects').findOne({ name: oldTypeProject.name })

    expect(after.content[0]).toBe(oldTypeProject.description)

    db.close()
  })
})

afterAll(() => {
  mongoose.connection.close()
})
