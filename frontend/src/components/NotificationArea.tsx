import React from 'react'
import './NotificationArea.css'
import { connect } from 'react-redux'
import { Message } from '../reducers/notificationReducer'
import { AppState } from '../index'

export interface StateProps {
    messages: Message[]
}

interface OwnProps {

}

const mapStateToProps = (state: AppState, props: OwnProps) => {
    return {
        messages: state.notification.messages
    }
}

const connector = connect(
    mapStateToProps,
    null
)

type Props = OwnProps & StateProps

const NotificationArea = (props: Props) => {
    const messages = props.messages

    console.log('messages:', messages)
    return (
        <div className='notificationContainer'>
            <div className='notification success'>
                Here is an important notification:
            </div>
        </div>
    )
}

export default connector(NotificationArea)
