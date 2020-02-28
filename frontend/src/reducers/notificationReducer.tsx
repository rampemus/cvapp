export enum Type {
    ERROR = 'error',
    SUCCESS = 'success',
    WARNING = 'warning'
}

export interface Message {
    text: string,
    id: string,
    type: Type,
    duration?: number
}

export interface NotificationState {
    visible: boolean,
    messages: Message[]
}

interface NotificationAction {
    type: string,
    id?: string,
    data: Message[]
}

// https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
const guidGenerator = () => {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

const initState: NotificationState = {
    visible: true,
    messages: []
} 

const notificationReducer = (state: NotificationState = initState, action: NotificationAction) => {
    switch (action.type) {
        case 'SHOW_NOTIFICATION': {
            const newMessages = state.messages.concat(action.data)
            const newState = {
                visible: true,
                messages: newMessages
            }
            return newState
        }
        case 'DELETE_NOTIFICATION': {
            const newMessages:Message[] = state.messages.filter(message => message.id !== action.id)
            const newState = {
                visible: (newMessages.length > 0),
                messages: newMessages
            }
            return newState
        }
        default: return state
    }
}


export const showNotification = (message:string, type:Type, lifeTime?:number ) => {
    return async (dispatch:any) => {
        const id = guidGenerator()
        const action: NotificationAction = {
            type: 'SHOW_NOTIFICATION',
            data: [{ text: message, id: id, type: type, duration: lifeTime }]
        }
        dispatch(action)
        if ( lifeTime ) {
            setTimeout(() => {
                const deleteAfterTimeoutAction: NotificationAction = {
                    type: 'DELETE_NOTIFICATION',
                    id: id,
                    data: []
                }
                dispatch(deleteAfterTimeoutAction)
            }, lifeTime * 1000 + 100)
        }
    }
    
}

export const deleteNotification = (id: string) => {
    const action:NotificationAction = {
        type: 'DELETE_NOTIFICATION',
        id: id,
        data: []
    }
    return action
}

export default notificationReducer
