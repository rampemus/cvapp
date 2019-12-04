export interface UserState {
    token: string,
    username: string,
    name: string,
}

interface SetUserAction {
    type: string,
    data: UserState
}

const loggedUserJSON = window.localStorage.getItem('loggedBlogsUser')
const user:UserState = loggedUserJSON ? JSON.parse(loggedUserJSON) : { token: '', username: '', name:'' }

const userReducer = (state: UserState | undefined = user, action: SetUserAction) => {
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