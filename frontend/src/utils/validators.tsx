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
const contentString = Joi.string().regex(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.()!?"#€$%&@£§|{}'-\\$\n]*$/).max(contentLength).empty('')
const nameLenth = 300
const nameString = Joi.string().regex(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.()!"#€$%&@£§|{}'-]*$/).max(nameLenth)
const username = Joi.string().alphanum().min(4).max(30)
const password = Joi.string().regex(/^[a-zA-Z0-9!#%&]*$/).min(8).max(64)
const name = Joi.string().regex(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]*$/).max(100)

export const CVSchema = Joi.object().keys({
  id: Joi.any(),
  github: Joi.string().uri().empty(''),
  name: nameString,
  techlist: contentString.empty(''),
  contact: Joi.any(),
  profile: Joi.any(),
  projects: Joi.any(),
  reference: Joi.any(),
  experience: Joi.any(),
  education: Joi.any(),
  communication: Joi.any(),
  skills: Joi.any(),
  info: Joi.any(),
  attachments: Joi.any(),
})

export const InfoSchema = Joi.object().keys({
  id: Joi.any(),
  content: contentString,
  name: nameString,
})

export const CommunicationSchema = Joi.object().keys({
  id: Joi.any(), 
  content: contentString,
  languages: Joi.array().items(Joi.object()),
  name: nameString,
})

export const ExperienceSchema = Joi.object().keys({
  id: Joi.any(), 
  description: contentString,
  name: nameString,
  timeFrame: Joi.object()
})

export const ProfileSchema = Joi.object().keys({
  id: Joi.any(), 
  content: contentString,
  name: nameString,
})

export const ProjectSchema = Joi.object().keys({
  id: Joi.any(), 
  description: contentString,
  githubUrl: Joi.string().uri().empty(''),
  name: nameString,
  showcaseUrl: Joi.string().uri().empty(''),
  thumbnailUrl: Joi.string().uri().empty('')
})

export const ContactSchema = Joi.object().keys({
  id: Joi.any(), 
  address: nameString.empty(''),
  company: nameString.empty(''),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fi'] } }),
  firstname: nameString,
  lastname: nameString,
  linkedin: Joi.string().uri().empty(''),
  phone: nameString.empty(''), // TODO: create phone regex
  phoneAvailable: nameString.empty(''),
  pictureUrl: Joi.string().uri().empty(''),
})

export const UserSchema = Joi.object().keys({
  expires: Joi.any(),
  name: name.empty(''),
  password: password.empty(''),
  oldPassword: password.empty(''),
  passwordConfirm: password.empty(''),
  username: username.empty(''),
})