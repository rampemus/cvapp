import React from 'react'
import './NotificationArea.css'
import { connect } from 'react-redux'
import { Message, deleteNotification } from '../reducers/notificationReducer'
import NotificationMessage from './NotificationMessage'
import { AppState } from '../index'

interface OwnProps {}
export interface StateProps {visible?: boolean, messages?: Message[]}
export interface DispatchProps { deleteNotification: Function }

const mapStateToProps = (state: AppState, props: OwnProps) => {
    return {
        visible: state.notification.visible,
        messages: state.notification.messages
    }
}

const mapDispatchToProps:DispatchProps = {
    deleteNotification
}

type Props = OwnProps & StateProps & DispatchProps

const NotificationArea: React.FC<Props> = (props) => {
    const { visible, messages } = props

    console.log(visible, messages)

    if ( messages ) {
        return (
            <div className='notificationContainer'>
                {messages.map( message => {
                    return (<NotificationMessage message={message} deleteNotification={() => props.deleteNotification(message.id)}></NotificationMessage>)
                })}
            </div>
        )
    }
    return (
        <div className='notificationContainer'></div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationArea)
