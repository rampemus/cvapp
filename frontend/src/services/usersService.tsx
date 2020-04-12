import axios, { AxiosResponse } from 'axios'
import { getConfigHeader } from '../utils/serviceHelper'
import { UserState } from '../reducers/userReducer'
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

const getOwner = (id:string, user: UserState) => {
  const request = axios.post(baseUrl + '/owner', { id }, getConfigHeader(user))
  return request.then((response: createUsersResponse) => response.data)
}

const getAll = (user: UserState) => {
  const request = axios.get(baseUrl, getConfigHeader(user))
  return request.then((response: getAllUsersResponse) => response.data)
}

const createUser = (user: UserState, username?: string, name?: string, password?: string, expires?: Date | null) => {
  const data = username || name || password ? { username, name, password, expires } : {}
  const request = axios.post(`${baseUrl}`, data, getConfigHeader(user))
  return request.then((response: createUsersResponse) => response)
}

const modifyUser = (user: UserState, id:string, changes: any) => {
  const request = axios.put(baseUrl, { changes, id }, getConfigHeader(user))
  return request.then((response: createUsersResponse) => response)
}

const deleteUser = (id:string, user: UserState) => {
  const request = axios.delete(`${baseUrl}/${id}`, getConfigHeader(user))
  return request.then( response => response)
}

export default { getAll, createUser, deleteUser, getOwner, modifyUser }
