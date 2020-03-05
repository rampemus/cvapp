const Joi = require('@hapi/joi')

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

export interface IJoiError {
    isJoi: boolean,
    details: IDetails[],
    context: {
        name: string | undefined,
        regex: RegExp,
        value: any,
        label: string,
        key: string
    },
    _object: {
        username: string,
        password: string,
    }
}

export interface IFormattedJoiError {
    message: string,
    field: string,
    id: string
}

const contentLength = 1000
const contentString = Joi.string().regex(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.()!?"#€$%&@£§|{}'-\\$\n]*$/).max(contentLength)
const nameLenth = 300
const nameString = Joi.string().regex(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.()!"#€$%&@£§|{}'-]*$/).max(nameLenth)
const objectId = Joi.string().regex(/^[a-f\d]{24}(temp)?$/i)

const InfoSchema = Joi.object().keys({
    id: objectId,
    content: contentString,
    name: nameString,
})

const CommunicationSchema = Joi.object().keys({
    id: objectId, 
    content: contentString,
    languages: Joi.array().items(Joi.object()),
    name: nameString,
})

const ExperienceSchema = Joi.object().keys({
    id: objectId, 
    description: contentString,
    name: nameString,
    timeFrame: Joi.object()
})

const ProfileSchema = Joi.object().keys({
    id: objectId, 
    content: contentString,
    name: nameString,
})

const ProjectSchema = Joi.object().keys({
    id: objectId, 
    description: contentString,
    githubUrl: Joi.string().uri(),
    name: nameString,
    showcaseUrl: Joi.string().uri(),
    thumbnailUrl: Joi.string().uri()
})

const ContactSchema = Joi.object().keys({
    id: objectId, 
    address: nameString,
    company: nameString,
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fi'] } }),
    firstname: nameString,
    lastname: nameString,
    linkedin: Joi.string().uri(),
    phone: nameString, // TODO: create phone regex
    phoneAvailable: nameString,
    pictureUrl: Joi.string().uri(),
})

export { Joi, contentString, nameString, InfoSchema, CommunicationSchema, ContactSchema, ProjectSchema, ExperienceSchema, ProfileSchema }