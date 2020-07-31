const SET_USER = 'SET_USER'
const LOGOUT_USER = 'LOGOUT_USER'

export interface UserState {
  token: string,
  username: string,
  name: string,
}

interface SetUserAction {
  type: string
  data: UserState
}

const loggedUserJSON = window.localStorage.getItem('loggedUser') || null
const user: UserState = loggedUserJSON ? JSON.parse(loggedUserJSON) : { token: '', username: '', name: '' }

const userReducer = (state: UserState | undefined = user, action: SetUserAction) => {
  switch (action.type) {
    case SET_USER: {
      return action.data
    }
    case LOGOUT_USER: {
      window.localStorage.removeItem('loggedUser')
      return { token: '', username: '', name: '' }
    }
    default: return state
  }
}

export const setUser = (user: UserState) => {
  const action: SetUserAction = {
    type: SET_USER,
    data: user
  }
  return action
}

export const logoutUser = () => {
  const action = {
    type: LOGOUT_USER,
  }
  return action
}

export default userReducer
