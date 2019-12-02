export enum Type {
    ERROR,
    SUCCESS,
    WARNING
}

export interface Message {
    text: string,
    type: Type
}

export interface NotificationState {
    visible: boolean,
    messages: Message[]
}

interface NotificationAction {
    type: string,
    data: Message[]
}

const initState: NotificationState = {
    visible: true,
    messages: [{
        text: 'Page loaded',
        type: Type.SUCCESS
    }]
} 

const notificationReducer = (state = initState, action: NotificationAction) => {
    switch (action.type) {
        case 'SHOW_NOTIFICATION': {
            const newMessages = state.messages.concat(action.data)
            const newState = {
                visible: true,
                messages: newMessages
            }
            return newState
        }
        default: return state
    }
}


export const showNotification = (message:string, type:Type) => {
    const action:NotificationAction = {
        type: 'SHOW_NOTIFICATION',
        data: [{ text: message, type: type }]
    }
    return action
}

export default notificationReducer
