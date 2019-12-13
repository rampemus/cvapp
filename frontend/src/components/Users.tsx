import React, { useState, useEffect } from 'react'
import './Users.css'
import UsersRow from './UsersRow'
import usersService, { IUser, usersError } from '../services/usersService'
import { showNotification, Type } from '../reducers/notificationReducer'
import { connect } from 'react-redux'
import Toolbar from './Toolbar'
import UsersForm from './UsersForm'

interface OwnProps { }
export interface StateProps { }
export interface DispatchProps {
  showNotification: Function
}

const mapDispatchToProps: DispatchProps = {
  showNotification
}

type Props = OwnProps & StateProps & DispatchProps

const Users: React.FC<Props> = (props) => {
  const [users, setUsers] = useState<IUser[]>([])
  
  useEffect(()=>{
    updateUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateUsers = () => {
    usersService.getAll().then(response => {
      setUsers(response)
      console.log('Users', response)
    }).catch((error: usersError) => {
      props.showNotification('Request for retrieving users was denied. ' + error.response.data.error, Type.ERROR, 4)
    })
  }

  const handleUserDelete = (id: string) => {
    const user:IUser | undefined = users.find(user => user.id === id)
    if ( user ) {
      usersService.deleteUser(id).then(
        response => {
          console.log('handleUserDelete response', response)
          setUsers(users.filter(user => user.id !== id))
          props.showNotification(`User ${user.name} was deleted`, Type.SUCCESS, 3)
        }
      ).catch((error) => props.showNotification(error.response.data.error, Type.ERROR, 5))
    } else {
        props.showNotification('User does not exist', Type.ERROR, 5)
    }
  }

  const handleAddRandomUser = () => {
    usersService.createUser().then(
      response => {
        props.showNotification(`User ${response.data.name} created. Username/password is ${response.data.username}/${response.data.password}`, Type.SUCCESS)
        updateUsers()
      }
    ).catch((error) => props.showNotification(error.response.data.error, Type.ERROR, 5))
  }

  const [showAddUser, setShowAddUser] = useState(false) 

  return(
    <div>
      <Toolbar>
        <div>
          <button className='toolbar-button' onClick={()=>handleAddRandomUser()}>add random user</button>
          <button className='toolbar-button' onClick={()=>{
            setShowAddUser(!showAddUser)
          }}>add user...</button>
        </div>
        <div className='formContainer' style={{ display: showAddUser ? 'block' : 'none' }}>
          <UsersForm closeForm={()=>setShowAddUser(false)}/>
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
          {users.map(user => {
            return (
              <UsersRow
                key={'usersrow' + user.id}
                user={user}
                handleUserDelete={()=>handleUserDelete(user.id)}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default connect(null,mapDispatchToProps)(Users)

