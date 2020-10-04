import React, { useEffect, useState } from 'react'
import usersService, { IUser, usersError } from '../../services/usersService'
import cvService, { ICV } from '../../services/cvService'
import { UserState } from '../../reducers/userReducer'
import { showNotification, Type } from '../../reducers/notificationReducer'
import { loadingReducerAction } from '../../reducers/loadingReducer'
import { connect, ConnectedProps } from 'react-redux'

interface OwnProps {
  showDefaultUserMenu: boolean,
  selectedCV: ICV | null,
  owner: UserState,
  setLoading: (loading: boolean) => loadingReducerAction,
}

const mapDispatchToProps = {
  showNotification
}

const connector = connect(null, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

const MyCVUserSelector: React.FC<Props> = (props) => {
  const [users, setUsers] = useState<IUser[]>([])
  const [defaults, setDefaults] = useState<String[]>([])

  const { showDefaultUserMenu, selectedCV, owner } = props

  useEffect(() => {
    updateUsers()
    updateDefaults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCV])

  const updateUsers = () => {
    usersService.getAll(owner).then(response => {
      setUsers(response)
      props.setLoading(false)
    }).catch((error: usersError) => {
      props.showNotification(
        'Request for retrieving users was denied. '
        + error.response.data.error,
        Type.ERROR, 4)
    })
  }
  
  const updateDefaults = () => {
    if (selectedCV) {
      cvService.getCVDefault(selectedCV.id, owner).then(response => {
        setDefaults(response.default ?? [])
      })
    }
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
          backgroundColor: defaults.includes(user.id)
            ? 'rgba(177, 255, 161, 0.637)'
            : 'rgba(255, 161, 161, 0.5)'
        }}
        onClick={(event) => {
          event.preventDefault()
          if (defaults.includes(user.id)) {
            props.showNotification('You can only add users', Type.ERROR, 4)
          } else {
            cvService
              .setCVDefault(selectedCV?.id ?? '', owner, user.id)
              .then((response) => {
                props.showNotification(`User ${user.username} will see ${selectedCV?.name} in their home page`, Type.SUCCESS, 4)
                setDefaults([...defaults, user.id])
              })
              .catch((error) => {
                if (error.response.data.error) {
                  props.showNotification(error.response.data.error, Type.ERROR, 12)
                }
              })
          }
        }}
      >
        <button 
          className='toolbar-button'
          style={{
            transform: 'scale(1.1)',
            transition: 'margin-left 0.2s ease',
            width: handleWidth + '%',
            marginLeft: defaults.includes(user.id)
              ? 'calc(' + (100 - handleWidth)  + '% - 15px)'
              : 'calc(-' + ( 100 - handleWidth )  + '% + 15px)',
            padding: '5px',
            borderRadius: '20px'
          }}
        >{user.username}</button>
      </p>)}
    </div>
  )
}

export default connector(MyCVUserSelector)
