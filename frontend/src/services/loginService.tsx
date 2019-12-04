import axios, { AxiosResponse } from 'axios'
const baseUrl = '/api/login'

interface loginResponse extends AxiosResponse {
    data: {
        token: string,
        username: string,
        name: string
    }
}

export interface loginError {
    response: {
        data:{
            error: string
        }
    }
}

const login = (username:string, password:string) => {
    const credentials = { 'username':username, 'password':password }
    const request = axios.post(baseUrl, credentials)
    return request.then((response: loginResponse) => response.data)
}

export default { login }
