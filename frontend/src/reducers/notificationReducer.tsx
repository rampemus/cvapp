export enum Type {
    ERROR,
    SUCCESS,
    WARNING
}

export interface Message {
    text: string,
    id: string,
    type: Type
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
    messages: [{
        text: 'Page loaded',
        id: 'defaultnotification',
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
        case 'DELETE_NOTIFICATION': {
            const newMessages = state.messages.map(message => {
                if (message.id !== action.id) {
                    return message
                }
            })
            const newState = {
                visible: ( newMessages.length > 0 ),
                messages: newMessages
            }
            return newState
        }
        default: return state
    }
}


export const showNotification = (message:string, type:Type) => {
    const id = guidGenerator()
    const action:NotificationAction = {
        type: 'SHOW_NOTIFICATION',
        data: [{ text: message, id:id, type: type }]
    }
    return action
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
