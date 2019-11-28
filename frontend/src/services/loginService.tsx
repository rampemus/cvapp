import axios from 'axios'
const baseUrl = '/api/login'

const login = (username:string, password:string) => {
    const credentials = { 'username':username, 'password':password }
    const request = axios.post(baseUrl, credentials)
    return request.then(response => response.data)
}

export default { login }
