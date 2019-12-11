import axios, { AxiosResponse } from 'axios'
const baseUrl = '/api/users'

export interface IUser {
    name: string,
    username: string,
    id: string,
    created: Date,
    expires?: Date,
    owner?: string,
}

interface loginResponse extends AxiosResponse {
    data: IUser[]
}

export interface usersError {
    response: {
        data: {
            error: string
        }
    }
}

const getAll = () => {

    const user = window.localStorage.getItem('loggedUser')

    // if (!user) {
    //     const error:userError = { response: { data: { error: 'user not logged in' } } }
    //     return error
    // }
        
    const userToken = user ? JSON.parse(user).token : '' 

    console.log('usersService',userToken)

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + userToken
        }
    }

    const request = axios.get(baseUrl, config)
    return request.then((response: loginResponse) => response.data)
}

export default { getAll }
