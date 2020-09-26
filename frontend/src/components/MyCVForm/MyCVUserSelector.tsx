import React, { useEffect, useState } from 'react'
import { loadingReducerAction } from '../../reducers/loadingReducer'
import { UserState } from '../../reducers/userReducer'
import { ICV } from '../../services/cvService'
import { showNotification, Type } from '../../reducers/notificationReducer'
import usersService, { IUser, usersError } from '../../services/usersService'

interface Props {
  showDefaultUserMenu: boolean,
  selectedCV: ICV | null,
  user: UserState,
  setLoading: (loading: boolean) => loadingReducerAction,
  showNotification: typeof showNotification
}

const MyCVUserSelector: React.FC<Props> = (props: Props) => {
  const [users, setUsers] = useState<IUser[]>([])
  const [defaults, setDefaults] = useState<String[]>(['rampemus'])

  const { showDefaultUserMenu, selectedCV, user } = props

  useEffect(() => {
    updateUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateUsers = () => {
    usersService.getAll(user).then(response => {
      setUsers(response)
      props.setLoading(false)
    }).catch((error: usersError) => {
      props.showNotification(
        'Request for retrieving users was denied. '
        + error.response.data.error,
        Type.ERROR, 4)
    })
  }
  
  const handleWidth = 60

  return(
    <div
      className='userSelectionContainer'
      style={{
        display: showDefaultUserMenu ? 'block' : 'none',
      }}
    >
      Users that have {selectedCV?.name} as default
      {users.map((user, index) => <p
        key={`user${index}`}
        style={{
          transition: 'background-color 0.2s ease',
          marginTop: '-8px',
          borderRadius: '20px',
          margin: '10px',
          cursor: 'pointer',
          textAlign: 'center',
          backgroundColor: defaults.includes(user.username) ? 'rgba(177, 255, 161, 0.637)' : 'rgba(255, 161, 161, 0.5)',
        }}
        onClick={(event) => {
          event.preventDefault()
          if (defaults.includes(user.username)) {
            setDefaults(defaults.filter(username => username !== user.username))
          } else {
            setDefaults([...defaults, user.username])
          }
        }}
      >
        <button 
          className='toolbar-button'
          style={{
            transform: 'scale(1.1)',
            transition: 'margin-left 0.2s ease',
            width: handleWidth + '%',
            marginLeft: defaults.includes(user.username) ? 'calc(' + (100 - handleWidth)  + '% - 15px)' : 'calc(-' + ( 100 - handleWidth )  + '% + 15px)',
            padding: '5px',
            borderRadius: '20px'
          }}
        >{user.username}</button>
      </p>)}
    </div>
  )
}

export default MyCVUserSelector
