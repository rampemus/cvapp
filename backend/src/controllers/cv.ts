import { Response, Router } from 'express'
import Communication from '../models/cv/communication'
import Contact from '../models/cv/contact'
import CurriculumVitae from '../models/cv/cv'
import Experience from '../models/cv/experience'
import Info from '../models/cv/info'
import Profile from '../models/cv/profile'
import Project from '../models/cv/project'
import User from '../models/user'
import { connectObjectToCVField, disconnectObjectFromCVField } from '../utils/cvHelper'
import { IRequestWithIdentity } from '../utils/middleware'
import {
  ChangesSchema,
  NewCommunicationSchema,
  NewContactSchema,
  NewCVSchema,
  NewExperienceSchema,
  NewInfoSchema,
  NewProfileSchema,
  NewProjectSchema,
  objectId,
  SetDefaultCVSchema,
  validationErrorSend,
  validationResponse,
} from '../utils/validators'

const cvRouter = Router()

cvRouter.get('/', async (request: IRequestWithIdentity, response: Response) => {
  const cvs = await CurriculumVitae.find({ $or: [
    { default: request.userid },
    { owner: request.userid }
  ] }).populate([
    'communication',
    'projects',
    'attachments',
    'education',
    'experience',
    'info',
    'reference',
    'skills',
    'contact',
    'profile',
  ])
  response.json(cvs.sort((a, b) => b.default.length - a.default.length ))
})

cvRouter.get('/:type', async (request: IRequestWithIdentity, response: Response) => {
  switch (request.params.type) {
    case 'contact':
      response.json(await Contact.find({}))
      break
    case 'profile':
      response.json(await Profile.find({}))
      break
    case 'project':
      response.json(await Project.find({}))
      break
    case 'experience':
      response.json(await Experience.find({}))
      break
    case 'communication':
      response.json(await Communication.find({}))
      break
    case 'info':
      response.json(await Info.find({}))
      break
    default:
      response.status(400).json({ error: '/cv/:type invalid'})
      break
  }
})

interface ICVConnect {
  id: string,
  field: string,
}

export interface INewInfoBody {
  name: string,
  content: string[],
  cv?: ICVConnect,
}

export interface INewCommunicationBody extends INewInfoBody {
  languages: [{
    language: string,
    level: string,
  }],
}

export interface INewExperienceBody {
  description: string,
  name: string,
  timeFrame?: {
    endDate: Date,
    startDate: Date
  },
  cv?: ICVConnect,
}

export interface INewProfileBody {
  name: string,
  content: string[],
  cv?: ICVConnect,
}

export interface INewProjectBody {
  description: string,
  githubUrl?: string,
  name: string,
  showcaseUrl?: string,
  thumbnailUrl?: string,
  cv?: ICVConnect,
}

export interface INewContactBody {
  address?: string,
  company?: string,
  email?: string,
  firstname: string,
  lastname: string,
  linkedin?: string,
  phone?: string,
  phoneAvailable?: string,
  pictureUrl?: string,
  cv?: ICVConnect,
  id?: string,
}

export interface INewCurriculumVitae {
  name: string,
  github?: string,
  techlist?: string,
  contact: INewContactBody,
  profile?: INewProfileBody,
  projects?: INewProjectBody[],
  reference?: INewContactBody[],
  experience?: INewExperienceBody[],
  education?: INewExperienceBody[],
  communication?: INewCommunicationBody,
  skills?: INewInfoBody,
  info?: INewInfoBody,
  attachments?: INewInfoBody,
  cv?: ICVConnect,
}

export interface IChanges {
  changes: any
  id: string,
}

cvRouter.post('/', async (request: IRequestWithIdentity, response: Response) => {
  const cvBody: INewCurriculumVitae = request.body
  const owner = await User.findOne({ _id: request.userid })

  const CVValidationResult: any = NewCVSchema.validate(cvBody)
  if (!validationErrorSend(response, CVValidationResult)) {

    const contactIsSaved = cvBody.contact && cvBody.contact.id

    if (contactIsSaved) {
      const cv = new CurriculumVitae({
        ...cvBody, owner
      })
      const savedCV = await cv.save()
        .catch((error) => {
          response.status(400).json({ error: error.message }).end()
        })
      response.status(201).json(savedCV)
    } else {
      const emptyContact = new Contact({ ...cvBody.contact, owner})
      const savedContact = await emptyContact.save()
        .catch((error) => {
          response.status(400).json({ error: error.messages }).end()
        })
      if (savedContact) {
        const cv = new CurriculumVitae({
          ...cvBody,
          contact: savedContact,
          owner,
        })
        const savedCV = await cv.save()
          .catch((error) => {
            response.status(400).json({ error: error.message }).end()
          })
        response.status(201).json(savedCV).end()
      }
    }
  }
})

export interface ISetDefaultCV {
  cvid: string,
  userid?: string,
}

cvRouter.post('/default', async (request: IRequestWithIdentity, response: Response) => {
  if (request.userGroup !== 'admin') {
    response.status(401).json({ error: 'Authorization error: Admin permissions needed' }).end()
  } else if (!validationErrorSend(response, SetDefaultCVSchema.validate(request.body))) {
    const requestBody: ISetDefaultCV = request.body
    if (!requestBody.cvid) {
      response.status(400).json({ error: 'CV id is empty' })
    }

    // TODO: implement single user default switch
    const users = await User.find({})
    await CurriculumVitae.updateMany({}, { default: [] })
    await CurriculumVitae.updateOne({ _id: requestBody.cvid },
      { default: users })
    response.status(200).json({ message: 'marked default for all users, cv id: ' + requestBody.cvid })
  }

})

cvRouter.post('/:type', async (request: IRequestWithIdentity, response: Response) => {
  const owner = await User.findOne({ _id: request.userid })
  switch (request.params.type) {
    case 'contact':
      const contactBody: INewContactBody = request.body
      if (validationErrorSend(response, NewContactSchema.validate(contactBody))) { break }
      const contact = new Contact({
        ...contactBody, owner
      })
      const savedContact = await contact.save()
        .catch((error) => {
          response.status(400).json({ error: error.message }).end()
        })
      if (contactBody.cv
        && savedContact
        && (contactBody.cv.field === 'contact' || contactBody.cv.field === 'reference') ) {
        await connectObjectToCVField(contactBody.cv.id, contactBody.cv.field, savedContact._id)
      }
      response.status(201).json(savedContact)
      break
    case 'profile':
      const profileBody: INewProfileBody = request.body
      if (validationErrorSend(response, NewProfileSchema.validate(profileBody))) { break }
      const profile = new Profile({
        ...profileBody, owner,
      })
      const savedProfile = await profile.save()
        .catch((error) => {
          response.status(400).json({ error: error.message }).end()
        })
      if (profileBody.cv && savedProfile && profileBody.cv.field === 'profile') {
        await connectObjectToCVField(profileBody.cv.id, profileBody.cv.field, savedProfile._id)
      }
      response.status(201).json(savedProfile)
      break
    case 'experience':
      const experienceBody: INewExperienceBody = request.body
      if (validationErrorSend(response, NewExperienceSchema.validate(experienceBody))) { break }
      const experience = new Experience({
        ...experienceBody, owner
      })
      const savedExperience = await experience.save()
        .catch((error) => {
          response.status(400).json({ error: error.message }).end()
        })
      if (experienceBody.cv && savedExperience
        && (experienceBody.cv.field === 'experience' || experienceBody.cv.field === 'education') ) {
        await connectObjectToCVField(experienceBody.cv.id, experienceBody.cv.field, savedExperience._id)
      }
      response.status(201).json(savedExperience)
      break
    case 'communication':
      const communicationBody: INewCommunicationBody = request.body
      if (validationErrorSend(response, NewCommunicationSchema.validate(communicationBody))) { break }
      const communication = new Communication({
        ...communicationBody, owner
      })
      const savedCommunication = await communication.save()
        .catch((error) => {
          response.status(400).json({ error: error.message }).end()
        })
      if (communicationBody.cv && savedCommunication && communicationBody.cv.field === 'communication') {
        await connectObjectToCVField(
          communicationBody.cv.id,
          communicationBody.cv.field,
          savedCommunication._id
        )
      }
      response.status(201).json(savedCommunication)
      break
    case 'info':
      const infoBody: INewProfileBody = request.body
      if (validationErrorSend(response, NewInfoSchema.validate(infoBody))) { break }
      const info = new Info({
        ...infoBody, owner
      })
      const savedInfo = await info.save()
        .catch((error) => {
          response.status(400).json({ error: error.message }).end()
        })
      if (infoBody.cv && savedInfo
        && (infoBody.cv.field === 'skills' || infoBody.cv.field === 'info' || infoBody.cv.field === 'attachments') ) {
          await connectObjectToCVField(infoBody.cv.id, infoBody.cv.field, savedInfo._id)
      }
      response.status(201).json(savedInfo)
      break
    case 'project':
      const projectBody: INewProjectBody = request.body
      if (validationErrorSend(response, NewProjectSchema.validate(projectBody))) { break }
      const project = new Project({
        ...projectBody, owner
      })
      const savedProject = await project.save()
        .catch((error) => {
          response.status(400).json({ error: error.message }).end()
        })
      if (projectBody.cv && savedProject && projectBody.cv.field === 'projects') {
        await connectObjectToCVField(projectBody.cv.id, projectBody.cv.field, savedProject._id)
      }
      response.status(201).json(savedProject)
      break
    default:
      response.status(400).json({ error: '/cv/:type invalid' })
      break
  }
})

cvRouter.put('/', async (request: IRequestWithIdentity, response: Response) => {
  const body: IChanges = request.body
  const validBody = !validationErrorSend(response, NewCVSchema.validate(body.changes))

  if ( validBody
    && request.userid + '' === (await CurriculumVitae.findOne({ _id: body.id })).owner + ''
    || request.userGroup === 'admin') {
    const newCV = await CurriculumVitae.findOneAndUpdate({ _id: body.id }, body.changes)
    response.status(201).json(newCV)
  } else if (validBody) {
    response.status(401).end()
  }
})

cvRouter.put('/:type', async (request: IRequestWithIdentity, response: Response) => {
  const body: IChanges = request.body
  if (!validationErrorSend(response, ChangesSchema.validate(body))) {
    switch (request.params.type) {
      case 'contact':
        if (validationErrorSend(response, NewContactSchema.validate(body.changes))) { break }
        const newContact = await Contact.updateOne(
          { _id: body.id, owner: request.userid },
          body.changes
        )
        response.status(201).json(newContact)
        break
      case 'profile':
        if (validationErrorSend(response, NewProfileSchema.validate(body.changes))) { break }
        const newProfile = await Profile.updateOne(
          { _id: body.id, owner: request.userid },
          body.changes
        )
        response.status(201).json(newProfile)
        break
      case 'experience':
        if (validationErrorSend(response, NewExperienceSchema.validate(body.changes))) { break }
        const newExperience = await Experience.updateOne(
          { _id: body.id, owner: request.userid },
          body.changes
        )
        response.status(201).json(newExperience)
        break
      case 'communication':
        if (validationErrorSend(response, NewCommunicationSchema.validate(body.changes))) { break }
        const newCommunication = await Communication.updateOne(
          { _id: body.id, owner: request.userid },
          body.changes
        )
        response.status(201).json(newCommunication)
        break
      case 'info':
        if (validationErrorSend(response, NewInfoSchema.validate(body.changes))) { break }
        const newInfo = await Info.updateOne(
          { _id: body.id, owner: request.userid },
          body.changes
        )
        response.status(201).json(newInfo)
        break
      case 'project':
        if (validationErrorSend(response, NewProjectSchema.validate(body.changes))) { break }
        const newProject = await Project.updateOne(
          { _id: body.id, owner: request.userid },
          body.changes
        )
        response.status(201).json(newProject)
        break
      default:
        response.status(400).json({ error: '/cv/:type invalid' })
        break
    }
  }
})

cvRouter.delete('/:id', async (request: IRequestWithIdentity, response: Response) => {
  const id = request.params.id

  const validationResult = objectId.validate(id)
  const validId = !validationErrorSend(response, validationResult)
  if (!validId) {
    return validationResponse(response, validationResult).end()
  }

  const cv: any = await CurriculumVitae.findOne({ _id: id })
  if (!cv) {
    response.status(400).json({ error: 'cv does not exist' }).end()
  }

  if (request.userid + '' === cv.owner + ''
    || request.userGroup === 'admin') {

    await CurriculumVitae.deleteOne({ _id: id })
    if (cv.contact) { Contact.deleteOne({ _id: cv.contact + '' }) }
    if (cv.profile) { await Profile.deleteOne({ _id: cv.profile + '' }) }
    if (cv.projects && cv.projects.length > 0) {
      cv.projects.map(async (project: any) => { await Project.deleteOne({ _id: project + '' }) })
    }
    if (cv.reference && cv.reference.length > 0) {
      cv.reference.map(async (contact: any) => { await Contact.deleteOne({ _id: contact + '' }) })
    }
    if (cv.experience && cv.experience.length > 0) {
      cv.experience.map(async (experience: any) => { await Experience.deleteOne({ _id: experience + '' }) })
    }
    if (cv.education && cv.education.length > 0) {
      cv.education.map(async (experience: any) => { await Experience.deleteOne({ _id: experience + '' }) })
    }
    if (cv.communication) {
      cv.communication.map(async (com: any) => { await Communication.deleteOne({ _id: com + '' }) })
    }
    if (cv.skills) {
      cv.skills.map(async (skills: any) => { await Info.deleteOne({ _id: skills + '' }) })
    }
    if (cv.info) {
      cv.info.map(async (info: any) => { await Info.deleteOne({ _id: info + '' }) })
    }
    if (cv.attachments) {
      cv.attachments.map(async (attachments: any) => { await Info.deleteOne({ _id: attachments + '' }) })
    }
    response.status(204).end()

  } else {
    response.status(401).end()
  }
})

cvRouter.delete('/:type/:id', async (request: IRequestWithIdentity, response: Response) => {
  const id = request.params.id

  const validationResult = objectId.validate(id)
  const validId = !validationErrorSend(response, validationResult)
  if (!validId) {
    return validationResponse(response, validationResult).end()
  }

  switch (request.params.type) {
    case 'contact':
      const referenceCV = await CurriculumVitae.findOne({ reference: request.params.id, owner: request.userid })
      const contactCV = await CurriculumVitae.findOne({ contact: request.params.id, owner: request.userid })
      if (contactCV) {
        response.status(403).end()
        break
      }
      await Contact.findOneAndDelete({ _id: id, owner: request.userid })
      if (!referenceCV) {
        response.status(404).end()
        break
      }
      await disconnectObjectFromCVField(
        referenceCV.id,
        'reference',
        request.params.id
      )
      response.status(204).end()
      break
    case 'profile':
      const profileCV = await CurriculumVitae.findOne({ profile: request.params.id, owner: request.userid })
      await Profile.findOneAndDelete({ _id: id, owner: request.userid })
      if (!profileCV) { response.status(404).end() }
      await disconnectObjectFromCVField(
        profileCV.id,
        'profile',
        request.params.id
      )
      response.status(204).end()
      break
    case 'experience':
      const experienceCV = await CurriculumVitae.findOne({ experience: id, owner: request.userid })
        || await CurriculumVitae.findOne({ education: id, owner: request.userid })
      await Experience.findOneAndDelete({ _id: id, owner: request.userid })
      if (!experienceCV) { response.status(404).end() }
      await disconnectObjectFromCVField(
        experienceCV._id,
        'experience',
        request.params.id
      )
      await disconnectObjectFromCVField(
        experienceCV._id,
        'education',
        request.params.id
      )
      response.status(204).end()
      break
    case 'communication':
      const communicationCV =
        await CurriculumVitae.findOne({ communication: id, owner: request.userid })
      await Communication.findOneAndDelete({ _id: id, owner: request.userid })
      if (!communicationCV) { response.status(404).end() }
      await disconnectObjectFromCVField(
        communicationCV._id,
        'communication',
        request.params.id
      )
      response.status(204).end()
      break
    case 'info':
      const infoCV = await CurriculumVitae.findOne({ skills: id, owner: request.userid })
        || await CurriculumVitae.findOne({ attachments: id, owner: request.userid })
        || await CurriculumVitae.findOne({ info: id, owner: request.userid })
      await Info.findOneAndDelete({ _id: id, owner: request.userid })
      if (!infoCV) { response.status(404).end() }
      await disconnectObjectFromCVField(
        infoCV._id,
        'skills',
        id
      )
      await disconnectObjectFromCVField(
        infoCV._id,
        'attachments',
        id
      )
      await disconnectObjectFromCVField(
        infoCV._id,
        'info',
        id
      )
      response.status(204).end()
      break
    case 'project':
      await Project.findOneAndDelete({ _id: id, owner: request.userid })
      const projectCVid = ( await CurriculumVitae.findOne({
          owner: request.userid, projects: id
        })).id
      await disconnectObjectFromCVField(
        projectCVid,
        'projects',
        id
      )
      response.status(204).end()
      break
    default:
      response.status(400).json({ error: '/cv/:type/:id invalid' }).end()
      break
  }
})

export default cvRouter
