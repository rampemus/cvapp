import axios, { AxiosResponse } from 'axios'
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

const getConfigHeader = () => {
    const user = window.localStorage.getItem('loggedUser')
    const userToken = user ? JSON.parse(user).token : ''
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + userToken
        }
    }
    return config
}

const getAll = () => {
    const request = axios.get(baseUrl, getConfigHeader())
    return request.then((response: getAllUsersResponse) => response.data)
}

const createUser = (username?: string, name?: string, password?: string) => {
    const data = username || name || password ? { username, name, password } : {}
    const request = axios.post(`${baseUrl}`, data, getConfigHeader())
    return request.then((response: createUsersResponse) => response)
}

const deleteUser = (id:string) => {
    const request = axios.delete(`${baseUrl}/${id}`, getConfigHeader())
    return request.then( response => response)
}

export default { getAll, createUser, deleteUser }
