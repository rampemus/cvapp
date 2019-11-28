import { Reducer } from 'redux'

export enum Type {
    ERROR,
    DEFAULT,
    WARNING
}

export interface NotificationState {
    message: string,
    type: Type
}

interface NotificationAction {
    type: string,
    data: NotificationState
}

const initState: NotificationState = {
    message: 'Page loaded',
    type: Type.DEFAULT
} 

const notificationReducer: Reducer<NotificationState, NotificationAction> = (state = initState, action) => {
    switch (action.type) {
        case 'SHOW_NOTIFICATION': {
            const newState:NotificationState = { message: action.data.message, type: action.data.type }
            return newState
        }
        default: return state
    }
}


export const showNotification = (message:string, type:Type) => {
    const action:NotificationAction = {
        type: 'SHOW_NOTIFICATION',
        data: { message: message, type:type }
    }
    return action
}

export default notificationReducer
