import { UserState } from "../reducers/userReducer"

const getConfigHeader = (user: UserState) => {
    const userToken = user.token
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + userToken
        }
    }
    return config
}

export { getConfigHeader }