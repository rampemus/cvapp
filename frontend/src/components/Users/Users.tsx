import React, { useState, useEffect } from 'react'
import './Users.scss'
import './Users.css'
import UsersRow from './UsersRow'
import usersService, { IUser, usersError } from '../../services/usersService'
import { showNotification, Type } from '../../reducers/notificationReducer'
import { connect, ConnectedProps } from 'react-redux'
import Toolbar from '../Toolbar'
import UsersForm from './UsersForm'
import { AppState } from '../..'
import { useLocation, Route } from 'react-router-dom'
import User from './User'
import { setLoading } from '../../reducers/loadingReducer'

interface OwnProps { }

const mapDispatchToProps = {
  showNotification,
  setLoading
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    user: state.user
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

const Users: React.FC<Props> = (props) => {
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    updateUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateUsers = () => {
    usersService.getAll(props.user).then(response => {
      setUsers(response)
      props.setLoading(false)
    }).catch((error: usersError) => {
      props.showNotification('Request for retrieving users was denied. ' + error.response.data.error, Type.ERROR, 4)
    })
  }

  const handleUserDelete = (id: string) => {
    props.setLoading(true)
    const user: IUser | undefined = users.find(user => user.id === id)
    if (user) {
      usersService.deleteUser(id, props.user).then(response => {
        setUsers(users.filter(user => user.id !== id))
        props.showNotification(`User ${user.name} was deleted`, Type.SUCCESS, 3)
        props.setLoading(false)
      }).catch((error) => props.showNotification(error.response.data.error, Type.ERROR, 5))
    } else {
      props.showNotification('User does not exist', Type.ERROR, 5)
    }
  }

  const handleAddRandomUser = () => {
    props.setLoading(true)
    usersService.createUser(props.user).then(
      response => {
        props.showNotification(
          `To view this CV in electronic format, please login to my https://rampemus-cvapp.herokuapp.com using username: ${response.data.username} and password: ${response.data.password}`,
          Type.SUCCESS
        )
        updateUsers()
      }
    ).catch((error) => props.showNotification(error.response.data.error, Type.ERROR, 5))
  }

  const [showAddUser, setShowAddUser] = useState(false)
  const location = useLocation()
  const userSelected = location.pathname.includes('/users') && location.pathname.length > '/users/'.length ? true : false

  if (userSelected) {
    return <Route exact path="/users/:username" render={({ match }) =>
      <User
        user={users.find(user => user.username === match.params.username)}
        updateUser={() => updateUsers()}
      />
    } />
  }
  return <div>
    <Toolbar>
      <div>
        <button id='AddRandomUser' className='toolbar-button' onClick={() => handleAddRandomUser()}>add random user</button>
        <button id='AddUser' className='toolbar-button' onClick={() => {
          setShowAddUser(!showAddUser)
        }}>add user...</button>
        <button disabled className='toolbar-button'>edit user...</button>
      </div>
      <div className='formContainer' style={{ display: showAddUser ? 'block' : 'none' }}>
        <UsersForm newUser closeForm={() => setShowAddUser(false)} reloadUsers={() => updateUsers()} />
      </div>
    </Toolbar>
    <h1>Users</h1>
    <table>
      <tbody>
        <tr>
          <th>Username</th>
          <th>Name</th>
          <th>Created/Expires</th>
          <th>Status</th>
          <th></th>
        </tr>
        {users.map(user => (
          <UsersRow
            key={'usersrow' + user.id}
            user={user}
            handleUserDelete={() => handleUserDelete(user.id)}
          />
        ))}
      </tbody>
    </table>
  </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)

