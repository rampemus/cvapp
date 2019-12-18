import { Request, Response, Router } from 'express'
import Communication from '../models/cv/communication'
import Contact from '../models/cv/contact'
import CurriculumVitae from '../models/cv/cv'
import Experience from '../models/cv/experience'
import Info from '../models/cv/info'
import Profile from '../models/cv/profile'
import Project from '../models/cv/project'
import User, { IUser } from '../models/user'
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

interface INewInfoBody {
    name: string,
    content: string[],
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
}

interface INewProfileBody {
    name: string,
    content: string[],
}

interface INewProjectBody {
    description: string,
    githubUrl?: string,
    name: string,
    showcaseUrl?: string,
    thumbnailUrl?: string,
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
}

export interface INewCurriculumVitae {
    name: string,
    github?: string,
    techlist?: string,
    contact: INewContactBody,
    profile?: INewProfileBody,
    project?: INewProjectBody[],
    reference?: INewContactBody[],
    experience?: INewExperienceBody[],
    education?: INewExperienceBody[],
    communication?: INewCommunicationBody,
    skills?: INewInfoBody,
    info?: INewInfoBody,
    attachments?: INewInfoBody,
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
            response.status(201).json(savedInfo)
            break
        case 'project':
            const projectBody: INewProjectBody[] = request.body
            const project = new Project({
                ...projectBody, owner
            })
            const savedProject = await project.save()
                .catch((error) => {
                    response.status(400).json({ error: error.message }).end()
                })
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
            const newContact = await Contact.findOneAndUpdate(
                { _id: changes.id },
                changes.changes
            )
            response.status(201).json(newContact)
            break
        case 'profile':
            const newProfile = await Profile.findOneAndUpdate(
                { _id: changes.id },
                changes.changes
            )
            response.status(201).json(newProfile)
            break
        case 'experience':
            const newExperience = await Experience.findOneAndUpdate(
                { _id: changes.id },
                changes.changes
            )
            response.status(201).json(newExperience)
            break
        case 'communication':
            const newCommunication = await Communication.findOneAndUpdate(
                { _id: changes.id },
                changes.changes
            )
            response.status(201).json(newCommunication)
            break
        case 'info':
            const newInfo = await Info.findOneAndUpdate(
                { _id: changes.id },
                changes.changes
            )
            response.status(201).json(newInfo)
            break
        case 'project':
            const newProject = await Project.findOneAndUpdate(
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

// TODO: PUT EDIT CV
// TODO: PUT EDIT object
// TODO: DELETE delete cv/object

export default cvRouter
