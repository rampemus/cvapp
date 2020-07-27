import mongodb from 'mongodb'
import mongoose from 'mongoose'
import { Document, model, Schema } from 'mongoose'
import Experience from '../models/cv/experience'
import Project from '../models/cv/project'
import User from '../models/user'
import { IUser } from '../models/user'
import { MONGODB_URI, ROOT_USERNAME } from './config'
import {
  connectObjectToCVField,
  deleteAllCVObjects,
  deleteAllCVs,
  disconnectObjectFromCVField,
  generateTestCV,
  userIsCVOwner
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
      owner: await User.findOne({}),
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
})

afterAll(() => {
  mongoose.connection.close()
})
