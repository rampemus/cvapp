import axios, { AxiosResponse } from 'axios'
import { IUser } from './usersService'
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

enum ServiceType {
    CV = '',
    CONTACT = '/contact',
    PROFILE = '/profile',
    EXPERIENCE = '/experience',
    COMMUNICATION = '/communication',
    INFO = '/info'
}

interface getAllResponse extends AxiosResponse {
    data: ICV[] | IContact[] | IProfile[] | IExperience[] | ICommunication[] | IInfo[]  
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

const getAll = (type: ServiceType) => {
    const request = axios.get(baseUrl+type)
    return request.then((response: getAllResponse) => response.data)
}

export default { createObject, replaceObject, deleteObject, getAll}
