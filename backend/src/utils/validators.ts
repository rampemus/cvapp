import Joi from '@hapi/joi'
import { Response } from 'express'

export interface IDetails {
    message: string,
    path: string[],
    type: string,
    context: {
        limit?: number,
        value: string,
        label: string,
        key: string,
        encoding: any
    }
}

const contentLength = 10000
const contentString = Joi.string().regex(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.()!?"#€$%&@£§|{}'-\\$]*$/).max(contentLength)
const nameLenth = 300
const nameString = Joi.string().regex(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.()!"#€$%&@£§|{}'-]*$/).max(nameLenth)
const objectId = Joi.string().regex(/^[a-f\d]{24}$/i)
const fieldString = Joi.string().valid('communication', 'projects', 'attachments', 'education', 'experience',
    'info', 'reference', 'skills', 'contact', 'profile')

const CVConnectSchema = Joi.object().keys({
    field: fieldString,
    id: objectId,
})

const NewInfoSchema = Joi.object().keys({
    content: Joi.array().items(contentString),
    cv: CVConnectSchema,
    name: nameString,
})

// TODO: define languages and levels in Enum
const NewCommunicationSchema = Joi.object().keys({
    content: Joi.array().items(contentString),
    cv: CVConnectSchema,
    languages: Joi.array().items(Joi.object()),
    name: nameString,
})

const NewExperienceSchema = Joi.object().keys({
    cv: CVConnectSchema,
    description: contentString,
    name: nameString,
    timeFrame: Joi.object()
})

const NewProjectSchema = Joi.object().keys({
    cv: CVConnectSchema,
    description: contentString,
    githubUrl: Joi.string().uri(),
    name: nameString,
    showcaseUrl: Joi.string().uri(),
    thumbnailUrl: Joi.string().uri()
})

const NewProfileSchema = Joi.object().keys({
    content: Joi.array().items(contentString),
    cv: CVConnectSchema,
    name: nameString,
})

const LoginRequestSchema = Joi.object().keys({
    password: Joi.string().regex(/^[a-zA-Z0-9!#%&]{8,64}$/),
    username: Joi.string().alphanum().min(4).max(30).required()
})

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

const NewCVSchema = Joi.object().keys({
    contact: NewContactSchema,
    cv: CVConnectSchema,
    github: Joi.string().uri(),
    name: nameString,
    techlist: contentString,
})

const ChangesSchema = Joi.object().keys({
    changes: Joi.object(),
    id: objectId
})

const validationError = (response: Response, validationResult: any) => {
    const errorArray: [IDetails] = validationResult && validationResult.error && validationResult.error.details
    if (errorArray && errorArray.length > 0) {
        response.status(400).send({
            error: errorArray[0].message
        }).end()
        return true
    }
    return false
}

const validationResponse = (response: Response, validationResult: any) => {
    const errorArray: [IDetails] = validationResult && validationResult.error && validationResult.error.details
    if (errorArray && errorArray.length > 0) {
        return response.status(400).send({
            error: errorArray[0].message
        })
    }
    return response.status(200)
}

const SetDefaultCVSchema = Joi.object().keys({
    cvid: objectId,
    userid: objectId
})

export {
    objectId,
    CVConnectSchema,
    NewInfoSchema,
    NewCommunicationSchema,
    NewExperienceSchema,
    NewProfileSchema,
    NewProjectSchema,
    LoginRequestSchema,
    NewContactSchema,
    NewCVSchema,
    ChangesSchema,
    validationError,
    SetDefaultCVSchema,
    validationResponse
}
