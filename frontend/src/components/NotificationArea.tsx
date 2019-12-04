import React from 'react'
import './NotificationArea.css'
import { connect } from 'react-redux'
import { Message } from '../reducers/notificationReducer'
import { AppState } from '../index'

interface OwnProps {

}

export interface StateProps {
    messages?: Message[]
}

export interface DispatchProps {

}

const mapStateToProps = (state: AppState, props: OwnProps) => {
    return {
        messages: state.notification.messages
    }
}

const mapDispatchToProps:DispatchProps = {

}

type Props = OwnProps & StateProps & DispatchProps

const NotificationArea: React.FC<Props> = (props) => {
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

export default connect(mapStateToProps, null)(NotificationArea)
