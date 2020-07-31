import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import {
  INewCommunicationBody,
  INewContactBody,
  INewExperienceBody,
  INewInfoBody,
  INewProfileBody,
  INewProjectBody,
  ISetDefaultCV
} from '../controllers/cv'
import Communication from '../models/cv/communication'
import Contact from '../models/cv/contact'
import CurriculumVitae from '../models/cv/cv'
import Experience from '../models/cv/experience'
import Info from '../models/cv/info'
import Profile from '../models/cv/profile'
import Project from '../models/cv/project'
import User from '../models/user'
import { MONGODB_URI, ROOT_PASSWORD, ROOT_USERNAME } from '../utils/config'
import { deleteAllCVObjects, deleteAllCVs, generateTestCV } from '../utils/cvHelper'
import { createRootUser, createTestUser, deleteAllUsers, getUserByUsername } from '../utils/userHelper'

const api = supertest(app)

let rootLogin: any = null
let testCV: any = null
let emptyTestCV: any = null

beforeAll(async () => {
  mongoose.set('useCreateIndex', true)
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

  await deleteAllCVs()
  await deleteAllCVObjects()

  await deleteAllUsers()
  await createRootUser()
  await createTestUser()
  await createTestUser()

  testCV = await generateTestCV(ROOT_USERNAME)

  rootLogin = await api
    .post('/api/login')
    .set('Content-Type', 'application/json')
    .send({ username: ROOT_USERNAME, password: ROOT_PASSWORD })
})

describe('/api/cv/default POST', () => {
  test('All users default switch', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const before = await CurriculumVitae.findOne({})
    const defaultCommand: ISetDefaultCV = {
      cvid: before._id
    }
    await api
      .post('/api/cv/default')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(defaultCommand)
      .expect(200)
    const after = await CurriculumVitae.findOne({})

    const numberOfUsers = (await User.find({})).length
    expect(before.default).toHaveLength(0)
    expect(after.default).toHaveLength(numberOfUsers)
  })
  test('Added user will get default from owner', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const newUser = await api
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(201)

    const after = await CurriculumVitae.findOne({})
    expect(after.default.map((id) => id + '')).toContain((await getUserByUsername(newUser.body.username))._id + '')
  })
  // test('Users get only boolean default values', async () => {
  // })
  // test('Default switched for single user', async () => {
  // })
  // test('User delete will inherit default', async () => {
  // })
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
    expect(myContact).toHaveProperty('linkedin')
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

    expect(myProject).toHaveProperty('content')
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

    expect(myJobExperience).toHaveProperty('content')
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
      pictureUrl: 'http://localhost:3004/kasvokuva.jpg',
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
      content: ['new description'],
      cv: { field: 'projects', id: emptyTestCV.body.id },
      githubUrl: 'https://github.com/rampemus/cvapp',
      name: 'new name',
      showcaseUrl: 'http://localhost:3004/',
      thumbnailUrl: 'http://localhost:3004/project1.png',
    }

    const savedProject = await api
      .post('/api/cv/project')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(newProject)
      .expect(201)

    const cvAfter = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id }).populate('projects')

    expect(savedProject.body.content[0]).toEqual(cvAfter.projects[0].content[0])
    expect(savedProject.body.githubUrl).toEqual(cvAfter.projects[0].githubUrl)
    expect(savedProject.body.name).toEqual(cvAfter.projects[0].name)
    expect(savedProject.body.showcaseUrl).toEqual(cvAfter.projects[0].showcaseUrl)
    expect(savedProject.body.thumbnailUrl).toEqual(cvAfter.projects[0].thumbnailUrl)
  })
  test('experience', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const newExperience: INewExperienceBody = {
      content: ['new description'],
      cv: { field: 'experience', id: emptyTestCV.body.id },
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

    expect(savedExperience.body.content[0]).toEqual(cvAfter.experience[0].content[0])
    expect(savedExperience.body.name).toEqual(cvAfter.experience[0].name)

    expect(savedEducation.body.content[0]).toEqual(cvAfter.education[0].content[0])
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
  //   // TODO: empty test
  // })
})

describe('/api/cv PUT', () => {
  test('Change name', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const modifications = {
      changes: { name: 'modified name' },
      id: emptyTestCV.body.id
    }

    const before = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })

    await api
      .put('/api/cv/')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(modifications)
      .expect(201)

    const after = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })

    expect(before.name).not.toEqual(after.name)
    expect(after.name).toEqual(modifications.changes.name)
  })
  test('Change github', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const modifications = {
      changes: { github: 'https://github.com/modified' },
      id: emptyTestCV.body.id
    }

    const before = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })

    await api
      .put('/api/cv/')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(modifications)
      .expect(201)

    const after = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })

    expect(before.github).not.toEqual(after.github)
    expect(after.github).toEqual(modifications.changes.github)
  })
  test('Change techlist', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const modifications = {
      changes: { techlist: 'modified techlist' },
      id: emptyTestCV.body.id
    }

    const before = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })

    await api
      .put('/api/cv/')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(modifications)
      .expect(201)

    const after = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })

    expect(before.techlist).not.toEqual(after.techlist)
    expect(after.techlist).toEqual(modifications.changes.techlist)
  })
})

describe('/api/cv/:type PUT', () => {
  test('Modify contact', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const cv = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })

    const modificationsContact = {
      changes: {
        address: 'modified address',
        company: 'modified company',
        email: 'modified@email.com',
        firstname: 'modified firstname',
        lastname: 'modified lastname',
        phone: 'modified phone number',
        phoneAvailable: 'modified phoneAvailable',
        pictureUrl: 'http://localhost:3000/project2.png',
      },
      id: cv.contact
    }

    const modificationsReference = {
      changes: {
        address: 'modified address',
        company: 'modified company',
        email: 'modified@email.fi',
        firstname: 'modified firstname',
        lastname: 'modified lastname',
        phone: 'modified phone number',
        phoneAvailable: 'modified phoneAvailable',
        pictureUrl: 'http://localhost:3000/project3.png',
      },
      id: cv.reference[0]
    }

    let before = await Contact.findOne({ _id: cv.contact })

    await api
      .put('/api/cv/contact')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(modificationsContact)
      .expect(201)

    let after = await Contact.findOne({ _id: cv.contact })

    expect(before.address).not.toEqual(after.address)
    expect(after.address).toEqual(modificationsContact.changes.address)

    before = await Contact.findOne({ _id: cv.reference })

    await api
      .put('/api/cv/contact')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(modificationsReference)
      .expect(201)

    after = await Contact.findOne({ _id: cv.reference })

    expect(before.address).not.toEqual(after.address)
    expect(after.address).toEqual(modificationsContact.changes.address)
  })
  test('Modify profile', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const cv = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })

    const modifications = {
      changes: {
        content: ['modified string array'],
        name: 'modified name',
      },
      id: cv.profile
    }

    const before = await Profile.findOne({ _id: cv.profile })

    await api
      .put('/api/cv/profile')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(modifications)
      .expect(201)

    const after = await Profile.findOne({ _id: cv.profile })

    expect(before.name).not.toEqual(after.name)
    expect(after.name).toEqual(modifications.changes.name)

    expect(before.content[0]).not.toEqual(after.content[0])
    expect(after.content[0]).toEqual(modifications.changes.content[0])
  })
  test('Modify project', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const cv = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })

    const modifications = {
      changes: {
        content: ['Modified description'],
        githubUrl: 'https://github.com/rampemus/modified',
        name: 'Modified name',
        showcaseUrl: 'http://localhost:3004',
        thumbnailUrl: 'http://localhost:3004/project3.png'
      },
      id: cv.projects[0]
    }

    const before = await Project.findOne({ _id: cv.projects[0] })

    await api
      .put('/api/cv/project')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(modifications)
      .expect(201)

    const after = await Project.findOne({ _id: cv.projects[0] })

    expect(before.content[0]).not.toEqual(after.content[0])
    expect(after.content[0]).toEqual(modifications.changes.content[0])

    expect(before.githubUrl).not.toEqual(after.githubUrl)
    expect(after.githubUrl).toEqual(modifications.changes.githubUrl)

    expect(before.name).not.toEqual(after.name)
    expect(after.name).toEqual(modifications.changes.name)

    expect(before.showcaseUrl).not.toEqual(after.showcaseUrl)
    expect(after.showcaseUrl).toEqual(modifications.changes.showcaseUrl)

    expect(before.thumbnailUrl).not.toEqual(after.thumbnailUrl)
    expect(after.thumbnailUrl).toEqual(modifications.changes.thumbnailUrl)
  })
  test('Modify experience', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const cv = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })

    const modifications = {
      changes: {
        content: ['Modified description'],
        name: 'Modified name',
        timeFrame: {
          endDate: new Date(),
          startDate: new Date()
        }
      },
      id: cv.experience[0]
    }

    const before = await Experience.findOne({ _id: cv.experience[0] })

    await api
      .put('/api/cv/experience')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(modifications)
      .expect(201)

    const after = await Experience.findOne({ _id: cv.experience[0] })

    expect(before.content[0]).not.toEqual(after.content[0])
    expect(after.content[0]).toEqual(modifications.changes.content[0])

    expect(before.name).not.toEqual(after.name)
    expect(after.name).toEqual(modifications.changes.name)

    expect(before.timeFrame.startDate).not.toEqual(after.timeFrame.startDate)
    expect(after.timeFrame.startDate).toEqual(modifications.changes.timeFrame.startDate)

    expect(before.timeFrame.endDate).not.toEqual(after.timeFrame.endDate)
    expect(after.timeFrame.endDate).toEqual(modifications.changes.timeFrame.endDate)
  })
  test('Modify communication', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const cv: any = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })

    const modifications = {
      changes: {
        content: ['modified string array'],
        languages: [{
          language: 'Modified language',
          level: 'Modified level',
        }],
        name: 'modified name',
      },
      id: cv.communication[0]
    }

    const before: any = await Communication.findOne({ _id: cv.communication[0] })

    await api
      .put('/api/cv/communication')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(modifications)
      .expect(201)

    const after: any = await Communication.findOne({ _id: cv.communication[0] })

    expect(before.name).not.toEqual(after.name)
    expect(after.name).toEqual(modifications.changes.name)

    expect(before.content[0]).not.toEqual(after.content[0])
    expect(after.content[0]).toEqual(modifications.changes.content[0])

    expect(before.languages[0].language).not.toEqual(after.languages[0].language)
    expect(after.languages[0].language).toEqual(modifications.changes.languages[0].language)

    expect(before.languages[0].level).not.toEqual(after.languages[0].level)
    expect(after.languages[0].level).toEqual(modifications.changes.languages[0].level)
  })
  test('Modify info', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const cv: any = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })

    const modifications = {
      changes: {
        content: ['modified string array'],
        name: 'modified name',
      },
      id: cv.info[0]
    }

    const before: any = await Info.findOne({ _id: cv.info[0] })

    await api
      .put('/api/cv/info')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(modifications)
      .expect(201)

    const after: any = await Info.findOne({ _id: cv.info[0] })

    expect(before.name).not.toEqual(after.name)
    expect(after.name).toEqual(modifications.changes.name)

    expect(before.content[0]).not.toEqual(after.content[0])
    expect(after.content[0]).toEqual(modifications.changes.content[0])
  })
  //   test('invalid type', async () => {
  //     // TODO: empty test

  //   })
})

describe('/api/cv/:id DELETE', () => {
  test('Deletes CV and all references objects', async () => {
    const token = 'bearer ' + rootLogin.body.token

    const cv: any = await CurriculumVitae.findOne({ _id: emptyTestCV.body.id })

    await api
      .delete('/api/cv/' + cv.id)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(204)

    expect((await CurriculumVitae.find({ _id: cv.id })).length).toBe(0)
    expect((await Contact.find({ _id: cv.contact[0] })).length).toBe(0)
    expect((await Contact.find({ _id: cv.reference[0] })).length).toBe(0)
    expect((await Profile.find({ _id: cv.profile[0] })).length).toBe(0)
    expect((await Project.find({ _id: cv.projects[0] })).length).toBe(0)
    expect((await Experience.find({ _id: cv.experience[0] })).length).toBe(0)
    expect((await Experience.find({ _id: cv.education[0] })).length).toBe(0)
    expect((await Communication.find({ _id: cv.communication[0] })).length).toBe(0)
    expect((await Info.find({ _id: cv.info[0] })).length).toBe(0)
    expect((await Info.find({ _id: cv.skills[0] })).length).toBe(0)
    expect((await Info.find({ _id: cv.attachments[0] })).length).toBe(0)
  })
})

describe('/api/cv/:type/:id DELETE', () => {
  test('Deletes contact and ref fields', async () => {
    const token = 'bearer ' + rootLogin.body.token

    await api
      .delete('/api/cv/contact/' + testCV.reference[0]._id)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(204)

    expect(await Contact.find({ _id: testCV.reference[0].id })).toHaveLength(0)
    const after: any = await CurriculumVitae.findOne({ _id: testCV.id })
    expect(after.reference).toHaveLength(0)
  })
  test('Deletes profile and ref fields', async () => {
    const token = 'bearer ' + rootLogin.body.token

    await api
      .delete('/api/cv/profile/' + testCV.profile._id)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(204)

    expect(await Contact.find({ _id: testCV.profile._id })).toHaveLength(0)
    const after: any = await CurriculumVitae.findOne({ _id: testCV.id })
    expect(after.profile).toBeNull()
  })
  test('Deletes projects and ref fields', async () => {
    const token = 'bearer ' + rootLogin.body.token

    await api
      .delete('/api/cv/project/' + testCV.projects[0]._id)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(204)

    expect(await Project.find({ _id: testCV.projects[0].id })).toHaveLength(0)
    const after: any = await CurriculumVitae.findOne({ _id: testCV.id })
    expect(after.projects).toHaveLength(0)

  })
  test('Deletes experience and ref fields education and experience', async () => {
    const token = 'bearer ' + rootLogin.body.token

    await api
      .delete('/api/cv/experience/' + testCV.experience[0]._id)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(204)

    expect(await Experience.find({ _id: testCV.experience[0].id })).toHaveLength(0)
    let after: any = await CurriculumVitae.findOne({ _id: testCV.id })
    expect(after.experience).toHaveLength(0)

    await api
      .delete('/api/cv/experience/' + testCV.education[0]._id)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(204)

    expect(await Experience.find({ _id: testCV.education[0].id })).toHaveLength(0)
    after = await CurriculumVitae.findOne({ _id: testCV.id })
    expect(after.education).toHaveLength(0)
  })
  test('Deletes communication and ref fields', async () => {
    const token = 'bearer ' + rootLogin.body.token

    await api
      .delete('/api/cv/communication/' + testCV.communication[0])
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(204)

    expect(await Info.find({ _id: testCV.communication[0] })).toHaveLength(0)
    const after = await CurriculumVitae.findOne({ _id: testCV.id })
    expect(after.communication).toBeNull()

  })
  test('Deletes info and ref fields info, skills and attachments', async () => {
    const token = 'bearer ' + rootLogin.body.token

    await api
      .delete('/api/cv/info/' + testCV.info[0])
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(204)

    expect(await Info.find({ _id: testCV.info[0] })).toHaveLength(0)
    let after = await CurriculumVitae.findOne({ _id: testCV.id })
    expect(after.info).toBeNull()

    await api
      .delete('/api/cv/info/' + testCV.skills[0])
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(204)

    expect(await Info.find({ _id: testCV.skills[0] })).toHaveLength(0)
    after = await CurriculumVitae.findOne({ _id: testCV.id })
    expect(after.skills).toBeNull()

    await api
      .delete('/api/cv/info/' + testCV.attachments[0])
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(204)

    expect(await Info.find({ _id: testCV.attachments[0] })).toHaveLength(0)
    after = await CurriculumVitae.findOne({ _id: testCV.id })
    expect(after.attachments).toBeNull()
  })
  test('invalid type: Delete contact field', async () => {
    const token = 'bearer ' + rootLogin.body.token

    await api
      .delete('/api/cv/contact/' + testCV.contact._id)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(403)
  })
})

afterAll(async () => {
  await deleteAllCVs()
  await deleteAllCVObjects()

  mongoose.connection.close()
})
