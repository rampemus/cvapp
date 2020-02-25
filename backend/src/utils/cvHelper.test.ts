import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import Communication from '../models/cv/communication'
import Contact from '../models/cv/contact'
import CurriculumVitae from '../models/cv/cv'
import Experience from '../models/cv/experience'
import Info from '../models/cv/info'
import Profile from '../models/cv/profile'
import Project from '../models/cv/project'
import User from '../models/user'
import { MONGODB_URI, ROOT_NAME, ROOT_PASSWORD, ROOT_USERNAME } from './config'
import { connectObjectToCVField, deleteAllCVObjects, deleteAllCVs, generateTestCV, userIsCVOwner } from './cvHelper'

const api = supertest(app)

beforeAll(async () => {
    mongoose.set('useCreateIndex', true)
    mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

    await deleteAllCVs()
    await deleteAllCVObjects()
})

test('deleteAllCVs', async () => {
    const owner = await User.findOne({})

    expect(await CurriculumVitae.find({})).toHaveLength(0)
    const repeat = 3
    for ( let i = 0; i < repeat; i++ ) {
        await new CurriculumVitae({
            contact: await new Contact({
                firstname: 'This will',
                lastname: 'be deleted',
                owner
            }).save(),
            owner
        }).save()
    }
    expect(await CurriculumVitae.find({})).toHaveLength(repeat)

    await deleteAllCVs()
    expect(await CurriculumVitae.find({})).toHaveLength(0)
})

test('deleteAllCVObjects', async () => {
    const owner = await User.findOne({})

    await deleteAllCVObjects()
    expect(await CurriculumVitae.find({})).toHaveLength(0)

    await new Contact({
        firstname: 'This will',
        lastname: 'be deleted',
        owner
    }).save()
    expect(await Contact.find({})).toHaveLength(1)
    await deleteAllCVObjects()
    expect(await Contact.find({})).toHaveLength(0)

    await new Info({
        name: 'This will be deleted',
        owner
    }).save()
    expect(await Info.find({})).toHaveLength(1)
    await deleteAllCVObjects()
    expect(await Info.find({})).toHaveLength(0)

    await new Profile({
        name: 'This will be deleted',
        owner
    }).save()
    expect(await Profile.find({})).toHaveLength(1)
    await deleteAllCVObjects()
    expect(await Profile.find({})).toHaveLength(0)

    await new Experience({
        description: 'be deleted',
        name: 'This will',
        owner
    }).save()
    expect(await Experience.find({})).toHaveLength(1)
    await deleteAllCVObjects()
    expect(await Experience.find({})).toHaveLength(0)

    await new Communication({
        name: 'This will be deleted',
        owner
    }).save()
    expect(await Communication.find({})).toHaveLength(1)
    await deleteAllCVObjects()
    expect(await Communication.find({})).toHaveLength(0)

    await new Project({
        description: 'be deleted',
        name: 'This will',
        owner
    }).save()
    expect(await Project.find({})).toHaveLength(1)
    await deleteAllCVObjects()
    expect(await Project.find({})).toHaveLength(0)

    await new CurriculumVitae({
        contact: await new Contact({
            firstname: 'This will',
            lastname: 'be deleted',
            owner
        }).save(),
        owner
    }).save()
    expect(await CurriculumVitae.find({})).toHaveLength(1)
    await deleteAllCVObjects()
    expect(await CurriculumVitae.find({})).toHaveLength(0)
})

test('userIsCVOwner', async () => {
    const owner = await User.findOne({})

    await new CurriculumVitae({
        contact: await new Contact({
            firstname: 'This needs',
            lastname: 'to have an owner',
            owner
        }).save(),
        owner
    }).save()

    expect(await userIsCVOwner(owner.username)).toBeTruthy()
})

test('connectObjectToCVField', async () => {
    const cv = await CurriculumVitae.findOne({})
    const owner = await User.findOne({})
    expect(cv).toBeDefined()

    const reference = await new Contact({
        firstname: 'This will',
        lastname: 'be connected',
        owner
    }).save()
    expect(await CurriculumVitae.find({ reference })).toHaveLength(0)
    await connectObjectToCVField(cv._id, 'reference', reference._id)
    expect(await CurriculumVitae.find({ reference })).toHaveLength(1)

    const info = await new Info({
        name: 'This will be connected',
        owner
    }).save()
    expect(await CurriculumVitae.find({ info })).toHaveLength(0)
    await connectObjectToCVField(cv._id, 'info', info._id)
    expect(await CurriculumVitae.find({ info })).toHaveLength(1)

    expect(await CurriculumVitae.find({ skills: info })).toHaveLength(0)
    await connectObjectToCVField(cv._id, 'skills', info._id)
    expect(await CurriculumVitae.find({ skills: info })).toHaveLength(1)

    expect(await CurriculumVitae.find({ attachments: info })).toHaveLength(0)
    await connectObjectToCVField(cv._id, 'attachments', info._id)
    expect(await CurriculumVitae.find({ attachments: info })).toHaveLength(1)

    const profile = await new Profile({
        name: 'This will be deleted',
        owner
    }).save()
    expect(await CurriculumVitae.find({ profile })).toHaveLength(0)
    await connectObjectToCVField(cv._id, 'profile', profile._id)
    expect(await CurriculumVitae.find({ profile })).toHaveLength(1)

    const experience = await new Experience({
        description: 'be deleted',
        name: 'This will',
        owner
    }).save()
    expect(await CurriculumVitae.find({ experience })).toHaveLength(0)
    await connectObjectToCVField(cv._id, 'experience', experience._id)
    expect(await CurriculumVitae.find({ experience })).toHaveLength(1)

    expect(await CurriculumVitae.find({ education: experience })).toHaveLength(0)
    await connectObjectToCVField(cv._id, 'education', experience._id)
    expect(await CurriculumVitae.find({ education: experience })).toHaveLength(1)

    const communication = await new Communication({
        name: 'This will be deleted',
        owner
    }).save()
    expect(await CurriculumVitae.find({ communication })).toHaveLength(0)
    await connectObjectToCVField(cv._id, 'communication', communication._id)
    expect(await CurriculumVitae.find({ communication })).toHaveLength(1)

    const project = await new Project({
        description: 'be deleted',
        name: 'This will',
        owner
    }).save()
    expect(await CurriculumVitae.find({ projects: project })).toHaveLength(0)
    await connectObjectToCVField(cv._id, 'projects', project._id)
    expect(await CurriculumVitae.find({ projects: project })).toHaveLength(1)
})

// test('disconnectObjectFromCVField', async () => {
//         // TODO: empty test

// })

// test('generateTestCV with username root_user', async () => {
//         // TODO: empty test

// })

afterAll(() => {
    mongoose.connection.close()
})
