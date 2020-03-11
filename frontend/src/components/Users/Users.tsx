import React, { useState, useEffect } from 'react'
import './Users.css'
import UsersRow from './UsersRow'
import usersService, { IUser, usersError } from '../../services/usersService'
import { showNotification, Type } from '../../reducers/notificationReducer'
import { connect } from 'react-redux'
import Toolbar from '../Toolbar'
import UsersForm from './UsersForm'
import { UserState } from '../../reducers/userReducer'
import { AppState } from '../..'
import { useLocation, Route } from 'react-router-dom'
import User from './User'

interface OwnProps { }
export interface StateProps {
  user: UserState
}
export interface DispatchProps {
  showNotification: Function
}

const mapDispatchToProps: DispatchProps = {
  showNotification
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    user: state.user
  }
}

type Props = OwnProps & StateProps & DispatchProps

const Users: React.FC<Props> = (props) => {
  const [users, setUsers] = useState<IUser[]>([])
  
  useEffect(()=>{
    updateUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateUsers = () => {
    usersService.getAll(props.user).then(response => {
      setUsers(response)
    }).catch((error: usersError) => {
      props.showNotification('Request for retrieving users was denied. ' + error.response.data.error, Type.ERROR, 4)
    })
  }

  const handleUserDelete = (id: string) => {
    const user:IUser | undefined = users.find(user => user.id === id)
    if ( user ) {
      usersService.deleteUser(id, props.user).then( response => {
        setUsers(users.filter(user => user.id !== id))
        props.showNotification(`User ${user.name} was deleted`, Type.SUCCESS, 3)
      }).catch((error) => props.showNotification(error.response.data.error, Type.ERROR, 5))
    } else {
      props.showNotification('User does not exist', Type.ERROR, 5)
    }
  }

  const handleAddRandomUser = () => {
    usersService.createUser(props.user).then(
      response => {
        props.showNotification(
          `User ${response.data.name} created. Username/password is ${response.data.username}/${response.data.password}`,
          Type.SUCCESS
        )
        updateUsers()
      }
    ).catch((error) => props.showNotification(error.response.data.error, Type.ERROR, 5))
  }

  const [showAddUser, setShowAddUser] = useState(false) 
  const location = useLocation()
  const userSelected = location.pathname.includes('/users/') ? true : false

  if (userSelected) {
    return <Route exact path="/users/:username" render={({ match }) => 
      <User
        user={users.find(user => user.username === match.params.username)}
        userForHeaders={props.user}
        updateUser={()=>updateUsers()}
      />
    }/>
  }
  return(
    <div>
      <Toolbar>
        <div>
          <button className='toolbar-button' onClick={()=>handleAddRandomUser()}>add random user</button>
          <button className='toolbar-button' onClick={()=>{
            setShowAddUser(!showAddUser)
          }}>add user...</button>
          <button disabled className='toolbar-button'>edit user...</button>
        </div>
        <div className='formContainer' style={{ display: showAddUser ? 'block' : 'none' }}>
          <UsersForm newUser closeForm={()=>setShowAddUser(false)} reloadUsers={()=>updateUsers()}/>
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
              handleUserDelete={()=>handleUserDelete(user.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default connect(mapStateToProps,mapDispatchToProps)(Users)

