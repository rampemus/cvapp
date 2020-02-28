import React, { useState, useEffect } from 'react'
import { Message } from '../reducers/notificationReducer'

interface Props {
    message: Message,
    duration?: number,
    deleteNotification: Function
}

const NotificationMessage: React.FC<Props> = (props) => {
    const message = props.message
    const duration = props.duration
    const [timeLeft, setTimeLeft] = useState(1)

    useEffect(()=>{
        if (duration) {
            const timer = setTimeout(() => {
                setTimeLeft(0)
                clearTimeout(timer)
            }, 100);
        }
    },[])

    const closeButton = () => {
        const r = 9
        return (
        <svg version="1.1"
            id="Layer_1"
            x="0px" y="0px"
            style={{
                width: '20px',
                height: '20px',
                position: 'static'
            }}
            viewBox="0 0 20 20"
            >
        <g transform="translate(10,10)">
            <circle style={{
                fill: 'none',
                backgroundColor: 'none',
                opacity: duration ? '.15' : '0', 
                strokeWidth: r,
                strokeDasharray: timeLeft * r * 3.14 + ' ' + r * 3.14,
                transition: 'stroke-dasharray ' + duration + 's ease',
                transform: 'scale(-1,1) rotate(-135deg)'
            }}  r={r/2} className="close-circle" />
        </g>
            <rect x="0.81" y="9.29" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 24.1421 10)" width="18.38" height="1.41"/>
            <rect x="0.66" y="9.4" transform="matrix(0.7071 0.7071 -0.7071 0.7071 10.038 -4.0285)" width="18.44" height="1.41"/>
        </svg>
    )} 



    return(
        <div key={message.id} className={`notification ${message.type}`}>
            <div className='notification-text'>{message.text}</div>
            <div
                className='notification-close-button'
                onClick={() => props.deleteNotification()}
            >{closeButton()}</div>
        </div>
    )
}

export default NotificationMessage
