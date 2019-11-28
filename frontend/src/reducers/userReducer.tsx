import { Reducer } from 'redux'

interface UserState {
    token: string,
    username: string,
    name: string,
}

interface SetUserAction {
    type: string,
    data: UserState
}

const loggedUserJSON = window.localStorage.getItem('loggedBlogsUser')
const user:UserState = loggedUserJSON ? JSON.parse(loggedUserJSON) : {}

const userReducer: Reducer<UserState, SetUserAction> = (state = user, action) => {
    switch (action.type) {
        case 'SET_USER': {
            return action.data
        }
        default: return state
    }
}

export const setUser = (user: UserState) => {
    const action:SetUserAction = {
        type: 'SET_USER',
        data: user
    }
    return action
}

export default userReducer