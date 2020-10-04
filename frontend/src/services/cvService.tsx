import axios, { AxiosResponse } from 'axios'
import { IUser } from './usersService'
import { getConfigHeader } from '../utils/serviceHelper'
import { Type } from '../reducers/notificationReducer'
import { UserState } from '../reducers/userReducer'
const baseUrl = '/api/cv'

export interface IContact {
  owner: IUser,
  address: string,
  company: string,
  email: string,
  firstname: string,
  lastname: string,
  linkedin: string
  phone: string,
  phoneAvailable: string,
  pictureUrl: string,
  id: string
}

export interface IExperience {
  content: string[],
  name: string,
  owner: IUser,
  timeFrame: {
    startDate: Date,
    endDate: Date,
  },
  id: string,
}

export interface IInfo {
  name: string,
  id: string,
  content: string[],
  owner: IUser,
}

export interface ICommunication extends IInfo {
  languages: {
    language: string,
    level: string,
  }[],
}

export interface IProfile {
  name: string,
  id: string,
  content: string[],
  owner?: IUser,
}

export interface IProject {
  content: string[],
  githubUrl: string,
  name: string,
  owner: IUser,
  showcaseUrl: string,
  thumbnailUrl: string,
  id: string,
}

export interface ICV extends ICVEmpty {
  owner: IUser,
  contact: IContact,
  id: string,
}

interface IContactEmpty {
  address?: string,
  company?: string,
  email?: string,
  firstname: string,
  lastname: string,
  linkedin?: string,
  phone?: string,
  phoneAvailable?: string,
  pictureUrl?: string,
}

interface ICVEmpty {
  name: string,
  github?: string,
  techlist?: string,
  contact: IContactEmpty,
  profile?: IProfile,
  projects?: IProject[],
  reference?: IContact[],
  experience?: IExperience[],
  education?: IExperience[],
  communication?: ICommunication,
  skills?: IInfo,
  info?: IInfo,
  attachments?: IInfo,
}

export enum ServiceType {
  CV = '',
  CONTACT = '/contact',
  PROFILE = '/profile',
  EXPERIENCE = '/experience',
  COMMUNICATION = '/communication',
  INFO = '/info',
  PROJECT = '/project'
}

interface getAllCVResponse extends AxiosResponse {
  data: ICV[]
}

const createEmptyCV = (user: UserState) => {
  const emptyCV: ICVEmpty = {
    name: 'name-required',
    contact: {
      firstname: 'firstname-required',
      lastname: 'lastname-required'
    }
  }
  const request = axios.post(baseUrl + ServiceType.CV, emptyCV, getConfigHeader(user))
  return request.then((response: any) => {
    return response.data
  })
}

const duplicateCV = (cv: ICV, user: UserState, showNotification?: Function) => {
  const duplicateContact: IContactEmpty = {
    address: cv.contact.address,
    company: cv.contact.company,
    email: cv.contact.email,
    firstname: cv.contact.firstname,
    lastname: cv.contact.lastname,
    linkedin: cv.contact.linkedin,
    phone: cv.contact.phone,
    phoneAvailable: cv.contact.phoneAvailable,
    pictureUrl: cv.contact.pictureUrl,
  }

  const duplicateProfile: any = cv.profile ? {
    content: cv.profile.content,
    name: cv.profile.name + ' duplicate'
  } : null

  const duplicateProjects: any = cv.projects ?
    cv.projects.map((project) => {
      return {
        // description: project.description,
        content: project.content,
        githubUrl: project.githubUrl,
        name: project.name + ' duplicate',
        showcaseUrl: project.showcaseUrl,
        thumbnailUrl: project.thumbnailUrl,
      }
    }) : null

  const duplicateReference: any = cv.reference ?
    cv.reference.map((contact: any) => {
      return {
        address: contact.address,
        company: contact.company,
        email: contact.email,
        firstname: contact.firstname,
        lastname: contact.lastname,
        phone: contact.phone,
        phoneAvailable: contact.phoneAvailable,
        pictureUrl: contact.pictureUrl,
      }
    }) : null

  const duplicateExperience: any = cv.experience ?
    cv.experience.map((experience: any) => {
      return {
        content: experience.content,
        name: experience.name + ' duplicate',
        timeFrame: {
          startDate: experience.timeFrame.startDate,
          endDate: experience.timeFrame.endDate,
        }
      }
    }) : null

  const duplicateEducation: any = cv.education ?
    cv.education.map((experience: any) => {
      return {
        content: experience.content,
        name: experience.name + ' duplicate',
        timeFrame: {
          startDate: experience.timeFrame.startDate,
          endDate: experience.timeFrame.endDate,
        }
      }
    }) : null

  const duplicateCommunication: any = cv.communication ? {
    name: cv.communication.name + 'duplicate',
    content: cv.communication.content,
    languages: cv.communication.languages.map((language: any) => {
      return {
        language: language.language,
        level: language.level
      }
    })
  } : null

  const duplicateSkills: any = cv.skills ? {
    name: cv.skills.name + ' duplicate',
    content: cv.skills.content
  } : null

  const duplicateInfo: any = cv.info ? {
    name: cv.info.name + ' duplicate',
    content: cv.info.content
  } : null

  const dupliaceAttachments: any = cv.attachments ? {
    name: cv.attachments.name + ' duplicate',
    content: cv.attachments.content
  } : null

  const duplicateCV: any = {
    name: cv.name,
    contact: duplicateContact,
    github: cv.github,
    techlist: cv.techlist
  }

  const request = axios.post(baseUrl + ServiceType.CV, duplicateCV, getConfigHeader(user))
  return request.then(async (response: any) => {
    const cvId = response.data.id

    await createObject(ServiceType.PROFILE, duplicateProfile, cvId, user, 'profile')

    duplicateProjects.map(async (project: any) =>
      await createObject(ServiceType.PROJECT, project, cvId, user, 'projects')
    )

    duplicateReference.map(async (reference: any) => {
      await createObject(ServiceType.CONTACT, reference, cvId, user, 'reference')
    })
    showNotification && showNotification('Profile, projects and references duplicated', Type.SUCCESS, 4.2)

    duplicateExperience.map(async (experience: any) => {
      await createObject(ServiceType.EXPERIENCE, experience, cvId, user, 'experience')
    })

    duplicateEducation.map(async (experience: any) => {
      await createObject(ServiceType.EXPERIENCE, experience, cvId, user, 'education')
    })
    showNotification && showNotification('Experiences and education duplicated', Type.SUCCESS, 4.4)

    await createObject(ServiceType.COMMUNICATION, duplicateCommunication, cvId, user, 'communication')

    await createObject(ServiceType.INFO, duplicateSkills, cvId, user, 'skills')

    await createObject(ServiceType.INFO, dupliaceAttachments, cvId, user, 'attachments')
    showNotification && showNotification('Communication, skills and attachments duplicated', Type.SUCCESS, 4.7)

    await createObject(ServiceType.INFO, duplicateInfo, cvId, user, 'info')

    return response.data
  })
}

const createObject = (type: ServiceType, object: any, id: string, user: UserState, field?: string) => {
  const newObjectWithoutIdAndOwner = Object.fromEntries(Object.entries(object).filter(([key, value]) => key !== 'id' && key !== 'owner' && value !== ''))
  const request = axios.post(baseUrl + type, { ...newObjectWithoutIdAndOwner, cv: { id, field: field ? field : '' } }, getConfigHeader(user))
  return request.then((response: any) => {
    return response.data
  }).catch(error => {
    console.log('create object error:', error.response.data.error)
  })
}

const modifyObject = (type: ServiceType, id: string, object: any, user: UserState) => {
  const changes = Object.fromEntries(Object.entries(object).filter(([key, value]) => key !== 'id'))
  const request = axios.put(baseUrl + type, { changes, id }, getConfigHeader(user))
  return request.then((response: any) => {
    return response.data
  }).catch(error => {
    console.log('modify object error:', error.response.data.error)
  })
}

const deleteObject = (type: ServiceType, id: string, user: UserState) => {
  const request = axios.delete(baseUrl + type + '/' + id, getConfigHeader(user))
  return request.then((response: any) => {
    return response.data
  })
}

interface IExperienceNoDate {
  content: string[],
  name: string,
  timeFrame: {
    startDate: string,
    endDate: string,
  },
  id: string,
}

interface ISetDefaultCV {
  cvid: string,
  userid?: string,
}

interface defaultResponse extends AxiosResponse {
  data: {
    message: string,
    default: string[]
  }
}

const getCVDefault = (cvid: string, user: UserState) => {
  const request = axios.get(baseUrl + '/default/' + cvid, getConfigHeader(user))
  
  return request.then((response: defaultResponse) => {
    return response.data
  })
}

const setCVDefault = (cv: string, user: UserState, userid?: string) => {
  const defaultCommand: ISetDefaultCV = {
    cvid: cv,
    userid
  }

  const request = axios.post(baseUrl + '/default', defaultCommand, getConfigHeader(user))
  return request.then((response: defaultResponse) => {
    return response.data
  })
}

const getAllCV = (user: UserState) => {
  const request = axios.get(baseUrl, getConfigHeader(user))
  return request.then((response: getAllCVResponse) => {
    const formattedData = response.data.map((cv: any) => {
      return {
        ...cv,
        communication: cv.communication ? cv.communication[0] : null,
        skills: cv.skills ? cv.skills[0] : null,
        info: cv.info ? cv.info[0] : null,
        attachments: cv.attachments ? cv.attachments[0] : null,
        experience: cv.experience.map((exp: IExperienceNoDate) => ({
          ...exp,
          timeFrame: {
            startDate: new Date(exp.timeFrame.startDate),
            endDate: new Date(exp.timeFrame.endDate)
          }
        })),
        education: cv.education.map((edu: IExperienceNoDate) => ({
          ...edu,
          timeFrame: {
            startDate: new Date(edu.timeFrame.startDate),
            endDate: new Date(edu.timeFrame.endDate)
          }
        }))
      }
    })
    return formattedData
  })
}

export default { createObject, modifyObject, deleteObject, getAllCV, createEmptyCV, duplicateCV, getCVDefault, setCVDefault }
