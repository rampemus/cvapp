import axios, { AxiosResponse } from 'axios'
import { IUser } from './usersService'
import { getConfigHeader } from '../utils/serviceHelper'
const baseUrl = '/api/cv'

export interface IContact {
    owner: IUser,
    address: string,
    company: string,
    email: string,
    firstname: string,
    lastname: string,
    phone: string,
    phoneAvailable: string,
    pictureUrl: string,
    id: string
}

export interface IExperience {
    description: string,
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
    description: string,
    githubUrl: string,
    name: string,
    owner: IUser,
    showcaseUrl: string,
    thumbnailUrl: string,
    id: string,
}

export interface ICV {
    owner: IUser,
    name: string,
    github?: string,
    techlist?: string,
    contact: IContact, // single
    profile?: IProfile, // single
    projects?: IProject[],
    reference?: IContact[],
    experience?: IExperience[],
    education?: IExperience[],
    communication?: ICommunication, // single
    skills?: IInfo, // single
    info?: IInfo, // single
    attachments?: IInfo, // single
    id: string,
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
    // | IContact[] | IProfile[] | IExperience[] | ICommunication[] | IInfo[]  
}

const createObject = (type: ServiceType, object?: ICV | IContact | IProfile | IExperience | ICommunication | IInfo ) => {
    console.log('created?:', type, object) 
}

const modifyObject = (type: ServiceType, id: string, object: any ) => {
    const changes = Object.fromEntries(Object.entries(object).filter(([key, value]) => key !== 'id'))
    const request = axios.put(baseUrl + type, { changes, id },getConfigHeader())
    return request.then((response:any) => {
        return response.data
    })
}

const deleteObject = (type: ServiceType, id: string) => {
    console.log('Delete?:', type, id)
}

const getAllCV = () => {
    const request = axios.get(baseUrl, getConfigHeader())
    return request.then((response: getAllCVResponse) => {
        // console.log('formatted data will be handling this:',response.data)
        // format data to match ICV interface (mongoose wiggles the non required values to arrays)
        const formattedData = response.data.map((cv:any) => {
            return { ...cv,
                communication: cv.communication ? cv.communication[0] : null,
                skills: cv.skills ? cv.skills[0] : null,
                info: cv.info ? cv.info[0] : null,
                attachments: cv.attachments ? cv.attachments[0] : null,
            }
        })
        return formattedData
    })
}

export default { createObject, modifyObject, deleteObject, getAllCV }
