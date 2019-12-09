import React, { useState } from 'react'
import { Message } from '../reducers/notificationReducer'

interface Props {
    message: Message,
    deleteNotification: Function
}

const NotificationMessage: React.FC<Props> = (props) => {
    const message = props.message


    const [hovered, setHovered] = useState<boolean>(false)

    return(
        <div key={message.id} className={`notification ${message.type}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className='notification-text'>{message.text}</div>
            <button
                className='notification-close-button'
                onClick={() => props.deleteNotification()}
                style={{ opacity: hovered ? 1 : 0 }}
            >X</button>
        </div>
    )
}

export default NotificationMessage
