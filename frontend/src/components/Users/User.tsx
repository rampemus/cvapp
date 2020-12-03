import React, { useState, useEffect } from 'react'
import Toolbar from '../Toolbar'
import UsersForm from './UsersForm'
import usersService, { IUser } from '../../services/usersService'
import { AppState } from '../..'
import { connect, ConnectedProps } from 'react-redux'

interface OwnProps {
  user?: IUser,
  updateUser: Function
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    userForHeaders: state.user
  }
}

const connector = connect(mapStateToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

const User: React.FC<Props> = (props) => {
  const user = props.user

  const [owner, setOwner] = useState<IUser | null>(null)
  const [showEditUser, setShowEditUser] = useState(false)

  useEffect(() => {
    if (user && user.id) {
      usersService.getOwner(user.id, props.userForHeaders).then(response => {
        setOwner(response)
      })
    }
    // eslint-disable-next-line
  }, [user])

  if (!user) {
    return <div>User not found</div>
  } else {
    const timeleftMillisecs: number = user.expires ? (new Date(user.expires).valueOf() - Date.now().valueOf()) : 0
    const expires = user.expires
      ? (timeleftMillisecs > 0
        ? 'User expires after '
        + Math.floor(timeleftMillisecs / (1000 * 60 * 60 * 24))
        + ' days '
        + Math.floor(timeleftMillisecs % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
        + ' hours'
        : 'User is expired')
      : 'User never expires'

    const created = owner ? new Date(user.created) : new Date()

    return <div>
      <Toolbar>
        <div>
          <button disabled className='toolbar-button'>add random user</button>
          <button disabled className='toolbar-button'>add user...</button>
          <button id='EditUser' className='toolbar-button' onClick={() => {
            setShowEditUser(!showEditUser)
          }}>
            edit user...
          </button>
          <div className='formContainer' style={{ display: showEditUser ? 'block' : 'none' }}>
            <UsersForm
              newUser={false}
              formValues={{
                id: props.user ? props.user.id : '',
                name: props.user ? props.user.name : '',
                username: props.user ? props.user.username : '',
                expires: props.user && props.user.expires
                  ? new Date(props.user.expires)
                  : undefined
              }}
              closeForm={() => setShowEditUser(false)}
              reloadUsers={() => { props.updateUser() }}
            />
          </div>
        </div>
      </Toolbar>
      <h1>{user.username}</h1>
      <h3>Information</h3>
      <p>{user.name}</p>
      <p>{owner
        ? 'User created by '
        + owner.username + ' '
        + created.getFullYear() + '-'
        + created.getMonth() + '-'
        + created.getDay()
        : 'User has no owner'}</p>
      <p>{expires}</p>
    </div>

  }
}

export default connector(User)
