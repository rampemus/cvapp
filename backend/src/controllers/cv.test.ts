import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import { INewCommunicationBody, INewContactBody, INewExperienceBody, INewInfoBody, INewProfileBody, INewProjectBody } from '../controllers/cv'
import CurriculumVitae from '../models/cv/cv'
import { MONGODB_URI, ROOT_PASSWORD, ROOT_USERNAME } from '../utils/config'
import { deleteAllCVObjects, deleteAllCVs, generateTestCV } from '../utils/cvHelper'

const api = supertest(app)

let rootLogin: any = null
let testCV: any = null
let emptyTestCV: any = null

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

        emptyTestCV = await api
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

describe('/api/cv/:type POST', () => {
    test('contact', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const newContact: INewContactBody = {
            address: 'new address',
            company: 'new company',
            cv: {
                field: 'contact',
                id: emptyTestCV.body.id,
            },
            email: 'new@email.com',
            firstname: 'new firstname',
            lastname: 'new lastname',
            phone: '01110101',
            phoneAvailable: 'sometimes',
            pictureUrl: 'kasvokuva.jpg',
        }

        const newReference: INewContactBody = {
            ...newContact,
            cv: { field: 'reference', id: emptyTestCV.body.id }
        }

        const savedContact = await api
            .post('/api/cv/contact')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(newContact)
            .expect(201)

        const savedReference = await api
            .post('/api/cv/contact')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(newReference)
            .expect(201)

        const cvAfter = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id }).populate(['contact', 'reference'])

        expect(savedContact.body.company).toEqual(cvAfter.contact.company)
        expect(savedContact.body.email).toEqual(cvAfter.contact.email)
        expect(savedContact.body.firstname).toEqual(cvAfter.contact.firstname)
        expect(savedContact.body.address).toEqual(cvAfter.contact.address)
        expect(savedContact.body.lastname).toEqual(cvAfter.contact.lastname)
        expect(savedContact.body.phone).toEqual(cvAfter.contact.phone)
        expect(savedContact.body.phoneAvailable).toEqual(cvAfter.contact.phoneAvailable)
        expect(savedContact.body.pictureUrl).toEqual(cvAfter.contact.pictureUrl)

        expect(savedReference.body.company).toEqual(cvAfter.reference[0].company)
        expect(savedReference.body.email).toEqual(cvAfter.reference[0].email)
        expect(savedReference.body.firstname).toEqual(cvAfter.reference[0].firstname)
        expect(savedReference.body.address).toEqual(cvAfter.reference[0].address)
        expect(savedReference.body.lastname).toEqual(cvAfter.reference[0].lastname)
        expect(savedReference.body.phone).toEqual(cvAfter.reference[0].phone)
        expect(savedReference.body.phoneAvailable).toEqual(cvAfter.reference[0].phoneAvailable)
        expect(savedReference.body.pictureUrl).toEqual(cvAfter.reference[0].pictureUrl)
    })
    test('profile', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const newProfile: INewProfileBody = {
            content: ['profile text', 'more profile text'],
            cv: { field: 'profile', id: emptyTestCV.body.id },
            name: 'new profile',
        }

        const savedProfile = await api
            .post('/api/cv/profile')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(newProfile)
            .expect(201)

        const cvAfter = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id }).populate('profile')

        expect(savedProfile.body.content[0]).toEqual(cvAfter.profile.content[0])
        expect(savedProfile.body.name).toEqual(cvAfter.profile.name)
    })
    test('project', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const newProject: INewProjectBody = {
            cv: { field: 'projects', id: emptyTestCV.body.id },
            description: 'new description',
            githubUrl: 'new githubUrl',
            name: 'new name',
            showcaseUrl: 'new showcaseUrl',
            thumbnailUrl: 'thubnailUrl',
        }

        const savedProject = await api
            .post('/api/cv/project')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(newProject)
            .expect(201)

        const cvAfter = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id }).populate('projects')

        expect(savedProject.body.description).toEqual(cvAfter.projects[0].description)
        expect(savedProject.body.githubUrl).toEqual(cvAfter.projects[0].githubUrl)
        expect(savedProject.body.name).toEqual(cvAfter.projects[0].name)
        expect(savedProject.body.showcaseUrl).toEqual(cvAfter.projects[0].showcaseUrl)
        expect(savedProject.body.thumbnailUrl).toEqual(cvAfter.projects[0].thumbnailUrl)
    })
    test('experience', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const newExperience: INewExperienceBody = {
            cv: { field: 'experience', id: emptyTestCV.body.id },
            description: 'new description',
            name: 'new name',
            timeFrame: {
                endDate: new Date(),
                startDate: new Date()
            },
        }

        const newEducation: INewExperienceBody = {
            ...newExperience,
            cv: { field: 'education', id: emptyTestCV.body.id }
        }

        const savedExperience = await api
            .post('/api/cv/experience')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(newExperience)

        const savedEducation = await api
            .post('/api/cv/experience')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(newEducation)

        const cvAfter = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })
            .populate(['experience', 'education'])

        expect(savedExperience.body.description).toEqual(cvAfter.experience[0].description)
        expect(savedExperience.body.name).toEqual(cvAfter.experience[0].name)

        expect(savedEducation.body.description).toEqual(cvAfter.education[0].description)
        expect(savedEducation.body.name).toEqual(cvAfter.education[0].name)
    })
    test('communication', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const newCommunication: INewCommunicationBody = {
            content: ['some content', 'for testing'],
            cv: { field: 'communication', id: emptyTestCV.body.id },
            languages: [{
                language: 'new language',
                level: 'experienced'
            }],
            name: 'new name'
        }

        const savedCommunication = await api
            .post('/api/cv/communication')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(newCommunication)

        const cvAfter: any = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })
            .populate('communication')

        expect(savedCommunication.body.name).toEqual(cvAfter.communication[0].name)
        expect(savedCommunication.body.languages[0].language).toEqual(cvAfter.communication[0].languages[0].language)
        expect(savedCommunication.body.languages[0].level).toEqual(cvAfter.communication[0].languages[0].level)
        expect(savedCommunication.body.content[0]).toEqual(cvAfter.communication[0].content[0])
    })
    test('info', async () => {
        const token = 'bearer ' + rootLogin.body.token

        const newInfo: INewInfoBody = {
            content: ['some info', 'for testing'],
            cv: { field: 'info', id: emptyTestCV.body.id },
            name: 'new name'
        }

        const newSkills: INewInfoBody = {
            content: ['some skills', 'for testing'],
            cv: { field: 'skills', id: emptyTestCV.body.id },
            name: 'new name'
        }

        const newAttachments: INewInfoBody = {
            content: ['some attachments', 'for testing'],
            cv: { field: 'attachments', id: emptyTestCV.body.id },
            name: 'new name'
        }

        const savedInfo = await api
            .post('/api/cv/info')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(newInfo)

        const savedSkills = await api
            .post('/api/cv/info')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(newSkills)

        const savedAttachments = await api
            .post('/api/cv/info')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(newAttachments)

        const cvAfter: any = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })
            .populate(['info', 'skills', 'attachments'])

        expect(savedInfo.body.name).toEqual(cvAfter.info[0].name)
        expect(savedInfo.body.content[0]).toEqual(cvAfter.info[0].content[0])

        expect(savedSkills.body.name).toEqual(cvAfter.skills[0].name)
        expect(savedSkills.body.content[0]).toEqual(cvAfter.skills[0].content[0])

        expect(savedAttachments.body.name).toEqual(cvAfter.attachments[0].name)
        expect(savedAttachments.body.content[0]).toEqual(cvAfter.attachments[0].content[0])
    })
    // test('invalid type', async () => {
    //     // TODO: empty test
    // })
})

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

// describe('/api/cv/:id DELETE', () => {
//     test('Finds test CV', async () => {
//         // TODO: empty test
//     })
// })

// describe('/api/cv/:type/:id DELETE', () => {
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
