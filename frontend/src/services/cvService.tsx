import axios, { AxiosResponse } from 'axios'
import { IUser } from './usersService'
import { getConfigHeader } from '../utils/serviceHelper'
const baseUrl = '/api/cv'

interface IContact {
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

interface IExperience {
    description: string,
    name: string,
    owner: IUser,
    timeFrame: {
        startDate: Date,
        endDate: Date,
    },
    id: string,
}

interface IInfo {
    name: string,
    id: string,
    content: string[],
    owner: IUser,
}

interface ICommunication extends IInfo {
    languages: [{
        language: string,
        level: string,
    }],
}

interface IProfile {
    name: string,
    id: string,
    content: string[],
    owner: IUser,
}

interface ICV {
    owner: IUser,
    name: string,
    github?: string,
    techlist?: string,
    contact: IContact,
    profile?: IProfile,
    reference?: IContact[],
    experience?: IExperience[],
    education?: IExperience[],
    communication?: ICommunication,
    skills?: IInfo,
    info?: IInfo,
    attachments?: IInfo,
    id: string,
}

export enum ServiceType {
    CV = '',
    CONTACT = '/contact',
    PROFILE = '/profile',
    EXPERIENCE = '/experience',
    COMMUNICATION = '/communication',
    INFO = '/info'
}

interface getAllCVResponse extends AxiosResponse {
    data: ICV[] 
    // | IContact[] | IProfile[] | IExperience[] | ICommunication[] | IInfo[]  
}

const createObject = (type: ServiceType, object: ICV | IContact | IProfile | IExperience | ICommunication | IInfo ) => {
    console.log('created?:', type, object) 
}

const replaceObject = (type: ServiceType, id: string, object: ICV | IContact | IProfile | IExperience | ICommunication | IInfo ) => {
    console.log('replace?', type, id, object)
}

const deleteObject = (type: ServiceType, id: string) => {
    console.log('Delete?:', type, id)
}

const getAllCV = () => {
    const request = axios.get(baseUrl, getConfigHeader())
    return request.then((response: getAllCVResponse) => response.data)
}

export default { createObject, replaceObject, deleteObject, getAllCV}
