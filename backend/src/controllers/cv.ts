import { Response, Router } from 'express'
import Joi from 'joi'
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
import { IJoiError } from './login'

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

const contentLength = 10000
const contentString = Joi.string().regex(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.()!"#€$%&@£§|{}'-]*$/).max(contentLength)
const nameLenth = 300
const nameString = Joi.string().regex(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.()!"#€$%&@£§|{}'-]*$/).max(nameLenth)
const objectId = Joi.string().regex(/^[a-f\d]{24}$/i)
const fieldString = Joi.string().valid('communication', 'projects', 'attachments', 'education', 'experience',
    'info', 'reference', 'skills', 'contact', 'profile')

interface ICVConnect {
    id: string,
    field: string,
}

const CVConnectSchema = Joi.object().keys({
    field: fieldString,
    id: objectId,
})

export interface INewInfoBody {
    name: string,
    content: string[],
    cv?: ICVConnect,
}

const NewInfoSchema = Joi.object().keys({
    content: Joi.array().items(contentString),
    cv: CVConnectSchema,
    name: nameString,
})

export interface INewCommunicationBody extends INewInfoBody {
    languages: [{
        language: string,
        level: string,
    }],
}

// TODO: define languages and levels in Enum
const NewCommunicationSchema = Joi.object().keys({
    content: Joi.array().items(contentString),
    cv: CVConnectSchema,
    languages: Joi.array().items(Joi.object()),
    name: nameString,
})

export interface INewExperienceBody {
    description: string,
    name: string,
    timeFrame?: {
        endDate: Date,
        startDate: Date
    },
    cv?: ICVConnect,
}

const NewExperienceSchema = Joi.object().keys({
    cv: CVConnectSchema,
    description: contentString,
    name: nameString,
    timeFrame: Joi.object()
})

export interface INewProfileBody {
    name: string,
    content: string[],
    cv?: ICVConnect,
}

const NewProfileSchema = Joi.object().keys({
    content: Joi.array().items(contentString),
    cv: CVConnectSchema,
    name: nameString,
})

export interface INewProjectBody {
    description: string,
    githubUrl?: string,
    name: string,
    showcaseUrl?: string,
    thumbnailUrl?: string,
    cv?: ICVConnect,
}

const NewProjectSchema = Joi.object().keys({
    cv: CVConnectSchema,
    description: contentString,
    githubUrl: Joi.string().uri(),
    name: nameString,
    showcaseUrl: Joi.string().uri(),
    thumbnailUrl: Joi.string().uri()
})

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

const NewContactSchema = Joi.object().keys({
    address: nameString,
    company: nameString,
    cv: CVConnectSchema,
    email: Joi.string().email(),
    firstname: nameString,
    id: objectId,
    lastname: nameString,
    linkedin: Joi.string().uri(),
    phone: nameString, // TODO: create phone regex
    phoneAvailable: nameString,
    pictureUrl: Joi.string().uri(),
})

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

const NewCVSchema = Joi.object().keys({
    contact: NewContactSchema,
    cv: CVConnectSchema,
    github: Joi.string().uri(),
    name: nameString,
    techlist: contentString,
})

export interface IChanges {
    changes: any
    id: string,
}

const ChangesSchema = Joi.object().keys({
    changes: Joi.object(),
    id: objectId
})

cvRouter.post('/', async (request: IRequestWithIdentity, response: Response) => {
    const cvBody: INewCurriculumVitae = request.body
    const owner = await User.findOne({ _id: request.userid })

    Joi.validate(cvBody, NewCVSchema, (error: IJoiError) => {
        if (error) {
            response.status(400).send({
                error: error.details[0].message
            }).end()
        }
    })

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
})

export interface ISetDefaultCV {
    cvid: string,
    userid?: string,
}

const SetDefaultCVSchema = Joi.object().keys({
    cvid: objectId,
    userid: objectId
})

cvRouter.post('/default', async (request: IRequestWithIdentity, response: Response) => {
    Joi.validate(request.body, SetDefaultCVSchema, (error: IJoiError) => {
        if (error) {
            response.status(400).send({
                error: error.details[0].message
            }).end()
        }
    })

    if (request.userGroup !== 'admin') {
        response.status(401).json({ error: 'Authorization error: Admin permissions needed' }).end()
    } else {
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

            Joi.validate(contactBody, NewContactSchema, (error: IJoiError) => {
                if (error) {
                    response.status(400).send({
                        error: error.details[0].message
                    }).end()
                }
            })

            const contact = new Contact({
                ...contactBody, owner
            })
            const savedContact = await contact.save()
                .catch((error) => {
                    response.status(400).json({ error: error.message }).end()
                })
            if (contactBody.cv && savedContact && (contactBody.cv.field === 'contact' || contactBody.cv.field === 'reference') ) {
                await connectObjectToCVField(contactBody.cv.id, contactBody.cv.field, savedContact._id)
            }
            response.status(201).json(savedContact)
            break
        case 'profile':
            const profileBody: INewProfileBody = request.body

            Joi.validate(profileBody, NewProfileSchema, (error: IJoiError) => {
                if (error) {
                    response.status(400).send({
                        error: error.details[0].message
                    }).end()
                }
            })

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

            Joi.validate(experienceBody, NewExperienceSchema, (error: IJoiError) => {
                if (error) {
                    response.status(400).send({
                        error: error.details[0].message
                    }).end()
                }
            })

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

            Joi.validate(communicationBody, NewCommunicationSchema, (error: IJoiError) => {
                if (error) {
                    response.status(400).send({
                        error: error.details[0].message
                    }).end()
                }
            })

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

            Joi.validate(infoBody, NewInfoSchema, (error: IJoiError) => {
                if (error) {
                    response.status(400).send({
                        error: error.details[0].message
                    }).end()
                }
            })

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

            Joi.validate(projectBody, NewProjectSchema, (error: IJoiError) => {
                if (error) {
                    response.status(400).send({
                        error: error.details[0].message
                    }).end()
                }
            })

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

    Joi.validate(body.changes, NewCVSchema, (error: IJoiError) => {
        if (error) {
            response.status(400).send({
                error: error.details[0].message
            }).end()
        }
    })

    if ( request.userid + '' === (await CurriculumVitae.findOne({ _id: body.id })).owner + ''
        || request.userGroup === 'Admin') {
        const newCV = await CurriculumVitae.findOneAndUpdate({ _id: body.id }, body.changes)
        response.status(201).json(newCV)
    } else {
        response.status(401).end()
    }

})

cvRouter.put('/:type', async (request: IRequestWithIdentity, response: Response) => {
    const body: IChanges = request.body
    Joi.validate(body, ChangesSchema, (error: IJoiError) => {
        if (error) {
            response.status(400).send({
                error: error.details[0].message
            }).end()
        }
    })

    switch (request.params.type) {
        case 'contact':
            Joi.validate(body.changes, NewContactSchema, (error: IJoiError) => {
                if (error) {
                    response.status(400).send({
                        error: error.details[0].message
                    }).end()
                }
            })
            const newContact = await Contact.updateOne(
                { _id: body.id, owner: request.userid },
                body.changes
            )
            response.status(201).json(newContact)
            break
        case 'profile':
            Joi.validate(body.changes, NewProfileSchema, (error: IJoiError) => {
                if (error) {
                    response.status(400).send({
                        error: error.details[0].message
                    }).end()
                }
            })
            const newProfile = await Profile.updateOne(
                { _id: body.id, owner: request.userid },
                body.changes
            )
            response.status(201).json(newProfile)
            break
        case 'experience':
            Joi.validate(body.changes, NewExperienceSchema, (error: IJoiError) => {
                if (error) {
                    response.status(400).send({
                        error: error.details[0].message
                    }).end()
                }
            })
            const newExperience = await Experience.updateOne(
                { _id: body.id, owner: request.userid },
                body.changes
            )
            response.status(201).json(newExperience)
            break
        case 'communication':
            Joi.validate(body.changes, NewCommunicationSchema, (error: IJoiError) => {
                if (error) {
                    response.status(400).send({
                        error: error.details[0].message
                    }).end()
                }
            })
            const newCommunication = await Communication.updateOne(
                { _id: body.id, owner: request.userid },
                body.changes
            )
            response.status(201).json(newCommunication)
            break
        case 'info':
            Joi.validate(body.changes, NewInfoSchema, (error: IJoiError) => {
                if (error) {
                    response.status(400).send({
                        error: error.details[0].message
                    }).end()
                }
            })
            const newInfo = await Info.updateOne(
                { _id: body.id, owner: request.userid },
                body.changes
            )
            response.status(201).json(newInfo)
            break
        case 'project':
            Joi.validate(body.changes, NewProjectSchema, (error: IJoiError) => {
                if (error) {
                    response.status(400).send({
                        error: error.details[0].message
                    }).end()
                }
            })
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
})

cvRouter.delete('/:id', async (request: IRequestWithIdentity, response: Response) => {
    const id = request.params.id
    const cv: any = await CurriculumVitae.findOne({ _id: id })
    if (!cv) {
        response.status(400).json({ error: 'cv does not exist' }).end()
    }

    if (request.userid + '' === cv.owner + ''
        || request.userGroup === 'Admin') {

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
    switch (request.params.type) {
        case 'contact':
            const referenceCV = await CurriculumVitae.findOne({ reference: request.params.id, owner: request.userid })
            const contactCV = await CurriculumVitae.findOne({ contact: request.params.id, owner: request.userid })
            if (contactCV) {
                response.status(403).end()
                break
            }
            await Contact.findOneAndDelete({ _id: request.params.id, owner: request.userid })
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
            await Profile.findOneAndDelete({ _id: request.params.id, owner: request.userid })
            if (!profileCV) { response.status(404).end() }
            await disconnectObjectFromCVField(
                profileCV.id,
                'profile',
                request.params.id
            )
            response.status(204).end()
            break
        case 'experience':
            const experienceCV = await CurriculumVitae.findOne({ experience: request.params.id, owner: request.userid })
                || await CurriculumVitae.findOne({ education: request.params.id, owner: request.userid })
            await Experience.findOneAndDelete({ _id: request.params.id, owner: request.userid })
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
                await CurriculumVitae.findOne({ communication: request.params.id, owner: request.userid })
            await Communication.findOneAndDelete({ _id: request.params.id, owner: request.userid })
            if (!communicationCV) { response.status(404).end() }
            await disconnectObjectFromCVField(
                communicationCV._id,
                'communication',
                request.params.id
            )
            response.status(204).end()
            break
        case 'info':
            const infoCV = await CurriculumVitae.findOne({ skills: request.params.id, owner: request.userid })
                || await CurriculumVitae.findOne({ attachments: request.params.id, owner: request.userid })
                || await CurriculumVitae.findOne({ info: request.params.id, owner: request.userid })
            await Info.findOneAndDelete({ _id: request.params.id, owner: request.userid })
            if (!infoCV) { response.status(404).end() }
            await disconnectObjectFromCVField(
                infoCV._id,
                'skills',
                request.params.id
            )
            await disconnectObjectFromCVField(
                infoCV._id,
                'attachments',
                request.params.id
            )
            await disconnectObjectFromCVField(
                infoCV._id,
                'info',
                request.params.id
            )
            response.status(204).end()
            break
        case 'project':
            await Project.findOneAndDelete({ _id: request.params.id, owner: request.userid })
            const projectCVid = ( await CurriculumVitae.findOne({
                    owner: request.userid, projects: request.params.id
                })).id
            await disconnectObjectFromCVField(
                projectCVid,
                'projects',
                request.params.id
            )
            response.status(204).end()
            break
        default:
            response.status(400).json({ error: '/cv/:type/:id invalid' }).end()
            break
    }
})

export default cvRouter
