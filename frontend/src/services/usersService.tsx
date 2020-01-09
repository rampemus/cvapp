import axios, { AxiosResponse } from 'axios'
import { getConfigHeader } from '../utils/serviceHelper'
const baseUrl = '/api/users'

export interface IUser {
    name: string,
    username: string,
    id: string,
    created: Date,
    expires?: Date,
    owner?: string,
    password?: string
}

interface getAllUsersResponse extends AxiosResponse {
    data: IUser[]
}

interface createUsersResponse extends AxiosResponse {
    data: IUser
}

export interface usersError {
    response: {
        data: {
            error: string
        }
    }
}

const getAll = () => {
    const request = axios.get(baseUrl, getConfigHeader())
    return request.then((response: getAllUsersResponse) => response.data)
}

const createUser = (username?: string, name?: string, password?: string, expires?: Date | null) => {
    const data = username || name || password ? { username, name, password, expires } : {}
    const request = axios.post(`${baseUrl}`, data, getConfigHeader())
    return request.then((response: createUsersResponse) => response)
}

const deleteUser = (id:string) => {
    const request = axios.delete(`${baseUrl}/${id}`, getConfigHeader())
    return request.then( response => response)
}

export default { getAll, createUser, deleteUser }
