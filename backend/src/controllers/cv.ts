import { Response, Router } from 'express'
import Communication from '../models/cv/communication'
import Contact from '../models/cv/contact'
import CurriculumVitae from '../models/cv/cv'
import Experience from '../models/cv/experience'
import Info from '../models/cv/info'
import Profile from '../models/cv/profile'
import Project from '../models/cv/project'
import User, { IUser } from '../models/user'
import { connectObjectToCVField } from '../utils/cvHelper'
import { IRequestWithIdentity } from '../utils/middleware'

const cvRouter = Router()

cvRouter.get('/', async (request: IRequestWithIdentity, response: Response) => {
    const cv = await CurriculumVitae.find({}).populate([
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
    response.json(cv)
})

cvRouter.get('/:type', async (request: IRequestWithIdentity, response: Response) => {
    const userId = request.userid
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

interface INewInfoBody {
    name: string,
    content: string[],
    cv?: ICVConnect,
}

interface INewCommunicationBody extends INewInfoBody {
    languages: [{
        language: string,
        level: string,
    }],
}

interface INewExperienceBody {
    description: string,
    name: string,
    timeFrame?: {
        endDate: Date,
        startDate: Date
    },
    cv?: ICVConnect,
}

interface INewProfileBody {
    name: string,
    content: string[],
    cv?: ICVConnect,
}

interface INewProjectBody {
    description: string,
    githubUrl?: string,
    name: string,
    showcaseUrl?: string,
    thumbnailUrl?: string,
    cv?: ICVConnect,
}

interface INewContactBody {
    address?: string,
    company?: string,
    email?: string,
    firstname: string,
    lastname: string,
    phone?: string,
    phoneAvailable?: string,
    pictureUrl?: string,
    cv?: ICVConnect,
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
    const contactBody: INewCurriculumVitae = request.body
    const owner = await (await User.findOne({ _id: request.userid }))
    const cv = new CurriculumVitae({
        ...contactBody, owner
    })
    const savedCV = await cv.save()
        .catch((error) => {
            response.status(400).json({ error: error.message }).end()
        })
    response.status(201).json(savedCV)
})

export interface ISetDefaultCV {
    cvid: string,
    userid?: string,
}

cvRouter.post('/default', async (request: IRequestWithIdentity, response: Response) => {
    if (request.userGroup !== 'admin') {
        response.status(401).json({ error: 'Authorization error: Admin permissions needed' }).end()
    }

    const requestBody: ISetDefaultCV = request.body
    if (!requestBody.cvid) {
        response.status(400).json({ error: 'CV id is empty' })
    }

    const users = await User.find({})
    await CurriculumVitae.updateMany({}, { default: [] })
    await CurriculumVitae.updateOne({ _id: requestBody.cvid },
        { default: users })
    response.status(200).json({ message: 'marked default for all users, cv id: ' + requestBody.cvid })
})

cvRouter.post('/:type', async (request: IRequestWithIdentity, response: Response) => {
    const owner = await User.findOne({ _id: request.userid })
    switch (request.params.type) {
        case 'contact':
            const contactBody: INewContactBody = request.body
            const contact = new Contact({
                ...contactBody, owner
            })
            const savedContact = await contact.save()
                .catch((error) => {
                    response.status(400).json({ error: error.message }).end()
                })
            if (contactBody.cv && savedContact) {
                if (contactBody.cv.field === 'contact' || contactBody.cv.field === 'reference') {
                    await connectObjectToCVField(contactBody.cv.id, contactBody.cv.field, savedContact._id)
                }
            }
            response.status(201).json(savedContact)
            break
        case 'profile':
            const profileBody: INewProfileBody = request.body
            const profile = new Profile({
                ...profileBody, owner
            })
            const savedProfile = await profile.save()
                .catch((error) => {
                    response.status(400).json({ error: error.message }).end()
                })
            if (profileBody.cv && savedProfile) {
                if (profileBody.cv.field === 'profile') {
                    await connectObjectToCVField(profileBody.cv.id, profileBody.cv.field, savedProfile._id)
                }
            }
            response.status(201).json(savedProfile)
            break
        case 'experience':
            const experienceBody: INewExperienceBody = request.body
            const experience = new Experience({
                ...experienceBody, owner
            })
            const savedExperience = await experience.save()
                .catch((error) => {
                    response.status(400).json({ error: error.message }).end()
                })
            if (experienceBody.cv && savedExperience) {
                if (experienceBody.cv.field === 'experience' || experienceBody.cv.field === 'education') {
                    await connectObjectToCVField(experienceBody.cv.id, experienceBody.cv.field, savedExperience._id)
                }
            }
            response.status(201).json(savedExperience)
            break
        case 'communication':
            const communicationBody: INewCommunicationBody = request.body
            const communication = new Communication({
                ...communicationBody, owner
            })
            const savedCommunication = await communication.save()
                .catch((error) => {
                    response.status(400).json({ error: error.message }).end()
                })
            if (communicationBody.cv && savedCommunication) {
                if (communicationBody.cv.field === 'communication') {
                    await connectObjectToCVField(
                        communicationBody.cv.id,
                        communicationBody.cv.field,
                        savedCommunication._id
                    )
                }
            }
            response.status(201).json(savedCommunication)
            break
        case 'info':
            const infoBody: INewProfileBody = request.body
            const info = new Info({
                ...infoBody, owner
            })
            const savedInfo = await info.save()
                .catch((error) => {
                    response.status(400).json({ error: error.message }).end()
                })
            if (infoBody.cv && savedInfo) {
                if (infoBody.cv.field === 'skills' || infoBody.cv.field === 'info' || infoBody.cv.field === 'attachments') {
                    await connectObjectToCVField(infoBody.cv.id, infoBody.cv.field, savedInfo._id)
                }
            }
            response.status(201).json(savedInfo)
            break
        case 'project':
            const projectBody: INewProjectBody = request.body
            const project = new Project({
                ...projectBody, owner
            })
            const savedProject = await project.save()
                .catch((error) => {
                    response.status(400).json({ error: error.message }).end()
                })
            if (projectBody.cv && savedProject) {
                if (projectBody.cv.field === 'project') {
                    await connectObjectToCVField(projectBody.cv.id, projectBody.cv.field, savedProject._id)
                }
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
    const newCV = await CurriculumVitae.findOneAndUpdate({ _id: body.id }, body.changes)
    response.status(201).json(newCV)
})

cvRouter.put('/:type', async (request: IRequestWithIdentity, response: Response) => {
    const changes: IChanges = request.body
    switch (request.params.type) {
        case 'contact':
            const newContact = await Contact.update(
                { _id: changes.id },
                changes.changes
            )
            response.status(201).json(newContact)
            break
        case 'profile':
            const newProfile = await Profile.update(
                { _id: changes.id },
                changes.changes
            )
            response.status(201).json(newProfile)
            break
        case 'experience':
            const newExperience = await Experience.update(
                { _id: changes.id },
                changes.changes
            )
            response.status(201).json(newExperience)
            break
        case 'communication':
            const newCommunication = await Communication.update(
                { _id: changes.id },
                changes.changes
            )
            response.status(201).json(newCommunication)
            break
        case 'info':
            const newInfo = await Info.update(
                { _id: changes.id },
                changes.changes
            )
            response.status(201).json(newInfo)
            break
        case 'project':
            const newProject = await Project.update(
                { _id: changes.id },
                changes.changes
            )
            response.status(201).json(newProject)
            break
        default:
            response.status(400).json({ error: '/cv/:type invalid' })
            break
    }
})

cvRouter.delete('/:id', async (request: IRequestWithIdentity, response: Response) => {
    const id = request.params.id
    const cv = await CurriculumVitae.findOne({ _id: id })

    if (!cv) {
        response.status(400).json({ error: 'cv does not exist' }).end()
    }

    await CurriculumVitae.deleteOne({ _id: id })
    if (cv.contact) { Contact.deleteOne({ _id: cv.contact }) }
    if (cv.profile) { await Contact.deleteOne({ _id: cv.profile }) }
    if (cv.projects && cv.projects.length > 0) {
        cv.projects.map(async (project) => { await Project.deleteOne({ _id: project }) })
    }
    if (cv.reference && cv.reference.length > 0) {
        cv.reference.map(async (contact) => { await Contact.deleteOne({ _id: contact }) })
    }
    if (cv.experience && cv.experience.length > 0) {
        cv.experience.map(async (experience) => { await Experience.deleteOne({ _id: experience }) })
    }
    if (cv.education) {
        cv.education.map(async (experience) => { await Experience.deleteOne({ _id: experience }) })
    }
    if (cv.communication) { await Communication.deleteOne({ _id: cv.communication }) }
    if (cv.skills) { await Info.deleteOne({ _id: cv.skills }) }
    if (cv.info) { await Info.deleteOne({ _id: cv.info }) }
    if (cv.attachments) { await Info.deleteOne({ _id: cv.attachments }) }
    response.status(204).end()
})

cvRouter.delete('/:type/:id', async (request: IRequestWithIdentity, response: Response) => {
    switch (request.params.type) {
        case 'contact':
            await Contact.findOneAndDelete({ _id: request.params.id })
            response.status(204).end()
            break
        case 'profile':
            await Profile.findOneAndDelete({ _id: request.params.id })
            response.status(204).end()
            break
        case 'experience':
            await Experience.findOneAndDelete({ _id: request.params.id })
            response.status(204).end()
            break
        case 'communication':
            await Communication.findOneAndDelete({ _id: request.params.id })
            response.status(204).end()
            break
        case 'info':
            await Info.findOneAndDelete({ _id: request.params.id })
            response.status(204).end()
            break
        case 'project':
            await Project.findOneAndDelete({ _id: request.params.id })
            response.status(204).end()
            break
        default:
            response.status(400).json({ error: '/cv/:type/:id invalid' }).end()
            break
    }
})

export default cvRouter
