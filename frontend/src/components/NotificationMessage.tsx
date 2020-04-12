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
  const [alive, setAlive] = useState(1)
  const [animation, setAnimation] = useState(true)

  useEffect(()=>{
    if (duration) {
      const timer = setTimeout(() => {
        setAlive(0)
        clearTimeout(timer)
      }, 100);
    }
  },[duration])

  const closeButton = () => {
    const r = 9
    return (
    <svg version="1.1"
      id="Layer_1"
      x="0px" y="0px"
      style={{
        width: '20px',
        height: '20px',
        position: 'static',
        transform: 'scale(1.2)'
      }}
      viewBox="0 0 20 20"
      >
    <g transform="translate(10,10)">
      <circle style={{
        fill: 'none',
        backgroundColor: 'none',
        opacity: duration ? '.25' : '0', 
        strokeWidth: r,
        strokeDasharray: alive * r * 3.14 + ' ' + r * 3.14,
        transition: 'stroke-dasharray ' + duration + 's linear',
        transform: 'scale(-1,1) rotate(-135deg)'
      }}  r={r/2} className="close-circle" />
    </g>
      <rect 
        x="0.81" y="9.29"
        transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 24.1421 10)"
        width="18.38" height="1.41"/>
      <rect 
        x="0.66" y="9.4"
        transform="matrix(0.7071 0.7071 -0.7071 0.7071 10.038 -4.0285)"
        width="18.44" height="1.41"/>
    </svg>
  )} 

  const deleted = message.id.substr(8) === 'deleted'

  return(
    <div 
      key={message.id.substr(0,8)} 
      className={`notification ${message.type}`}
      style={{
        transition: 'all 0.4s ease',
        maxHeight: deleted ? '0' : '50px',
        paddingTop: deleted ? '0' : '10px',
        paddingBottom: deleted ? '0' : '10px',
        marginTop: deleted ? '0' : '5px',
        marginBottom: deleted ? '0' : '4px',
        overflow: deleted ? 'hidden' : 'auto',
        display: animation ? 'grid' : 'none',
      }}
    >
      <div className='notification-text'
        style={{
          transition: 'all 0.4s ease',
          opacity: deleted ? '0' : '1'
        }}
      >{message.text}</div>
      <div   
        style={{
          transition: 'all 0.4s ease',
          opacity: deleted ? '0' : '1'
        }}
        className='notification-close-button'
        onClick={() => {
          props.deleteNotification()
          setAnimation(false)
        }}
      >{closeButton()}</div>
    </div>
  )
}

export default NotificationMessage
