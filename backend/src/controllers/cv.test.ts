import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import { MONGODB_URI, ROOT_NAME, ROOT_PASSWORD, ROOT_USERNAME } from '../utils/config'
import { deleteAllCVObjects, deleteAllCVs, generateTestCV } from '../utils/cvHelper'

const api = supertest(app)

let rootLogin: any = null
let testCV: any = null

beforeAll(async () => {
    mongoose.set('useCreateIndex', true)
    mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

    rootLogin = await api
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({ username: ROOT_USERNAME, password: ROOT_PASSWORD })

    await deleteAllCVs()
    await deleteAllCVObjects()

    testCV = await generateTestCV(ROOT_USERNAME)
})

describe('/api/cv GET', () => {
    test('Finds test CV', async () => {

        const token = 'bearer ' + rootLogin.body.token

        const cvs = await api
            .get('/api/cv')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(200)

        expect(cvs.body).toHaveLength(1)

        const cv = cvs.body[0]
        expect(cv.id).toEqual(testCV.id)
        expect(cv).toHaveProperty('owner')
        expect(cv).toHaveProperty('name')
        expect(cv).toHaveProperty('github')
        expect(cv).toHaveProperty('techlist')
        expect(cv).toHaveProperty('contact')
        expect(cv).toHaveProperty('profile')
        expect(cv).toHaveProperty('projects')
        expect(cv).toHaveProperty('reference')
        expect(cv).toHaveProperty('experience')
        expect(cv).toHaveProperty('education')
        expect(cv).toHaveProperty('communication')
        expect(cv).toHaveProperty('skills')
        expect(cv).toHaveProperty('info')
        expect(cv).toHaveProperty('attachments')
    })
})

describe('/api/cv/:type GET', () => {
    test('contact', async () => {
        // TODO: empty test
        const token = 'bearer ' + rootLogin.body.token

        const contacts = await api
            .get('/api/cv/contact')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(contacts.body).toHaveLength(2)

        const myContact = contacts.body[0]

        expect(myContact).toHaveProperty('address')
        expect(myContact).toHaveProperty('company')
        expect(myContact).toHaveProperty('email')
        expect(myContact).toHaveProperty('firstname')
        expect(myContact).toHaveProperty('lastname')
        expect(myContact).toHaveProperty('owner')
        expect(myContact).toHaveProperty('phone')
        expect(myContact).toHaveProperty('phoneAvailable')
    })
    test('profile', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const profiles = await api
            .get('/api/cv/profile')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(profiles.body).toHaveLength(1)

        const myProfile = profiles.body[0]

        expect(myProfile).toHaveProperty('content')
        expect(myProfile).toHaveProperty('name')
        expect(myProfile).toHaveProperty('owner')
    })
    test('project', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const projects = await api
            .get('/api/cv/project')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(projects.body).toHaveLength(1)

        const myProject = projects.body[0]

        expect(myProject).toHaveProperty('description')
        expect(myProject).toHaveProperty('githubUrl')
        expect(myProject).toHaveProperty('name')
        expect(myProject).toHaveProperty('owner')
        expect(myProject).toHaveProperty('showcaseUrl')
        expect(myProject).toHaveProperty('thumbnailUrl')
    })
    test('experience', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const experiences = await api
            .get('/api/cv/experience')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(experiences.body).toHaveLength(2)

        const myJobExperience = experiences.body[0]

        expect(myJobExperience).toHaveProperty('description')
        expect(myJobExperience).toHaveProperty('name')
        expect(myJobExperience).toHaveProperty('owner')
        expect(myJobExperience).toHaveProperty('timeFrame')
    })
    test('communication', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const communications = await api
            .get('/api/cv/communication')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(communications.body).toHaveLength(1)

        const communication = communications.body[0]

        expect(communication).toHaveProperty('content')
        expect(communication).toHaveProperty('name')
        expect(communication).toHaveProperty('owner')
        expect(communication).toHaveProperty('languages')

    })
    test('info', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const infos = await api
            .get('/api/cv/info')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)

        expect(infos.body).toHaveLength(4)

        const info = infos.body[0]

        expect(info).toHaveProperty('content')
        expect(info).toHaveProperty('name')
        expect(info).toHaveProperty('owner')
    })
    test('invalid type', async () => {
        const token = 'bearer ' + rootLogin.body.token

        await api
            .get('/api/cv/totallyinvalid')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(400)

        await api
            .get('/api/cv/:type')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(400)
    })
})

describe('/api/cv POST', () => {
    test('Without required contact', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const noContactCV = {
            name: 'no contact CV'
        }

        await api
            .post('/api/cv/')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(noContactCV)
            .expect(400)
    })
    test('With required contact and name', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const minimalCV = {
            contact: {
                firstname: 'firstname-required',
                lastname: 'lastname-required'
            },
            name: 'name-required'
        }

        await api
            .post('/api/cv/')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(minimalCV)
            .expect(201)
    })
})

// describe('/api/cv/default POST', () => {
//     test('Single user has different default', async () => {
//         // TODO: empty test
        
//     })
//     test('All will have same default', async () => {
//         // TODO: empty test

//     })
// })

// describe('/api/cv/:type POST', () => {
//     test('contact', async () => {
//         // TODO: empty test
//     })
//     test('profile', async () => {

//         // TODO: empty test
//     })
//     test('project', async () => {
//         // TODO: empty test

//     })
//     test('experience', async () => {
//         // TODO: empty test

//     })
//     test('communication', async () => {
//         // TODO: empty test

//     })
//     test('info', async () => {
//         // TODO: empty test

//     })
//     test('invalid type', async () => {
//         // TODO: empty test

//     })
// })

// describe('/api/cv PUT', () => {
//     test('Finds test CV', async () => {
//         // TODO: empty test
//     })
// })

// describe('/api/cv/:type PUT', () => {
//     test('contact', async () => {
//         // TODO: empty test
//     })
//     test('profile', async () => {

//         // TODO: empty test
//     })
//     test('project', async () => {
//         // TODO: empty test

//     })
//     test('experience', async () => {
//         // TODO: empty test

//     })
//     test('communication', async () => {
//         // TODO: empty test

//     })
//     test('info', async () => {
//         // TODO: empty test

//     })
//     test('invalid type', async () => {
//         // TODO: empty test

//     })
// })

// describe('/api/cv DELETE', () => {
//     test('Finds test CV', async () => {
//         // TODO: empty test
//     })
// })

// describe('/api/cv/:type DELETE', () => {
//     test('contact', async () => {
//         // TODO: empty test
//     })
//     test('profile', async () => {

//         // TODO: empty test
//     })
//     test('project', async () => {
//         // TODO: empty test

//     })
//     test('experience', async () => {
//         // TODO: empty test

//     })
//     test('communication', async () => {
//         // TODO: empty test

//     })
//     test('info', async () => {
//         // TODO: empty test

//     })
//     test('invalid type', async () => {
//         // TODO: empty test

//     })
// })

afterAll(async () => {
    await deleteAllCVs()
    await deleteAllCVObjects()

    mongoose.connection.close()
})
