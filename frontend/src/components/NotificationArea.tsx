import React, { useState, useEffect } from 'react'
import './NotificationArea.css'
import { connect } from 'react-redux'
import { Message, deleteNotification } from '../reducers/notificationReducer'
import NotificationMessage from './NotificationMessage'
import { AppState } from '../index'

interface OwnProps {}
export interface StateProps {messages: Message[]}
export interface DispatchProps { deleteNotification: Function }

const mapStateToProps = (state: AppState, props: OwnProps) => {
    return {
        messages: state.notification.messages
    }
}

const mapDispatchToProps:DispatchProps = {
    deleteNotification
}

type Props = OwnProps & StateProps & DispatchProps

const NotificationArea: React.FC<Props> = (props) => {

    const [messages, setMessages] = useState(props.messages)

    useEffect(()=>{
        const newMessages = props.messages.filter(
            propsmessage =>messages.findIndex(message => message.id === propsmessage.id) === -1
        )
        setMessages(messages.map( message => 
            props.messages.findIndex(propsmessage => propsmessage.id === message.id) > -1 
            ? message 
            : { ...message, id: message.id.substr(0, 8) + 'deleted'}
         ).concat(newMessages))
        // adding messages to useEffect dependencies will crash the app
        // eslint-disable-next-line
    },[props.messages])

    if ( messages ) {
        return (
            <div className='notificationContainer' style={{opacity: messages.length > 0 ? 1 : 0}}>
                {messages.map( message => {
                    return (<NotificationMessage
                        key={message.id.substr(0,8)}
                        message={message}
                        deleteNotification={() =>
                            props.deleteNotification(message.id)}
                        duration={message.duration}>
                    </NotificationMessage>)
                })}
            </div>
        )
    }
    return (
        <div className='notificationContainer'></div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationArea)
