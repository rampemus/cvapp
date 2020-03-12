import React, { useState } from 'react'
import { showNotification, Type } from '../../reducers/notificationReducer'
import { connect } from 'react-redux'
import usersService, { usersError } from '../../services/usersService'
import { UserState } from '../../reducers/userReducer'
import { AppState } from '../..'

interface OwnProps {
  closeForm: Function,
  reloadUsers: Function,
  newUser: boolean,
  formValues?: {
    id: string,
    name: string,
    username: string,
    expires?: Date | null
  } 
}
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

const UsersForm: React.FC<Props> = (props) => {
  const [name, setName] = useState(props.formValues ? props.formValues.name : '')
  const [username, setUsername] = useState(props.formValues ? props.formValues.username : '')
  const [expires, setExpires] = useState<Date | undefined | null>(undefined)
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  
  enum CalcDate {
    TWO_WEEKS = Date.now() + 1000 * 60 * 60 * 24 * 14,
    ONE_MONTH = Date.now() + 1000 * 60 * 60 * 24 * 30
  }
  
  const handleCreateUser = (event: any) => {
    event.preventDefault()
    
    if ( password === passwordConfirm ) {
      usersService.createUser(props.user, username, name, password, expires).then( response => {
        setName('')
        setUsername('')
        setExpires(undefined)
        setPassword('')
        setPasswordConfirm('')
        props.showNotification(`User ${response.data.name} was created`, Type.SUCCESS, 4)
        props.reloadUsers()
        props.closeForm()
      }).catch((error: usersError) => props.showNotification(error.response.data.error, Type.ERROR, 5))
    } else {
      props.showNotification('Password and password confirmation does not match', Type.WARNING, 4)
    }
  }

  const handleModifyUser = (event: any) => {
    event.preventDefault()

    const changes = {
      name: props.formValues && props.formValues.name !== name ? name : undefined,
      username: props.formValues && props.formValues.username !== username ? username : undefined,
      password: oldPassword.length > 8 ? oldPassword : undefined,
      newPassword: passwordConfirm.length > 0 && passwordConfirm === password ? passwordConfirm : undefined,
      expires: props.formValues && props.formValues.expires && props.formValues.expires !== expires ? expires : undefined
    }

    usersService.modifyUser(
      props.user,
      props.formValues ? props.formValues.id : '',
      changes
    ).then((response) => {
      setOldPassword('')
      setPassword('')
      setPasswordConfirm('')
      props.reloadUsers()
      props.closeForm()
    }).catch((error: usersError) => {
      props.showNotification(error.response.data.error, Type.ERROR, 5) 
    })
  }
  
  const [passwordMatch, setPasswordMatch] = useState(true)
  
  const checkPasswordMatch = (password1: string, password2:string) => {
    setPasswordMatch(password1 === password2)
  }
  
  return(
    <form onSubmit={props.newUser ? handleCreateUser : handleModifyUser} autoComplete='off'>
      {props.newUser ? 'Create new custom user' : 'Edit user information'}
      <p>Full name</p> 
      <input
        type='text'
        value={name}
        onChange={
          ({ target }) => setName(target.value)
        }
        className='user-form-input'
      />
      <p>Username</p> 
      <input
        type='text'
        value={username}
        onChange={
          ({ target }) => setUsername(target.value)
        }
        className='user-form-input'
      />
      {props.newUser ? <p>User is valid</p> : <p>User is valid after update (admin only)</p>}
      <div>
        <input type="radio" name="expires" onClick={() => setExpires(new Date(CalcDate.TWO_WEEKS))}/> a fortnight
        <input type="radio" name="expires" onClick={() => setExpires(new Date(CalcDate.ONE_MONTH))} /> a month
        <input type="radio" name="expires" onClick={() => setExpires(null)} /> forever
      </div>
      {!props.newUser && [<p key='olduserparagraph'>Re-enter old password</p>,
      <input
        key='olduserinputfield'
        type='password'
        value={oldPassword}
        onChange={
          ({ target }) => {
            setOldPassword(target.value)
          }
        }
        className='user-form-input'
        style={{ backgroundColor: oldPassword.length > 8 || (password.length + passwordConfirm.length) === 0 ? 'white' : 'rgb(255, 161, 161)'}}
      />]
      }
      {props.newUser ? <p>Password for new user</p> : <p>New password</p>}
      <input
        type='password'
        value={password}
        onChange={
          ({ target }) => {
            setPassword(target.value)
            if (passwordConfirm.length > 0) {
              checkPasswordMatch(target.value, passwordConfirm)
            }
          }
        }
        className='user-form-input'
        style={{ backgroundColor: passwordMatch ? 'white' : 'yellow' }}
      />
      {props.newUser ? <p>Confirm password</p> : <p>Confirm new password</p>}
      <input
        type='password'
        value={passwordConfirm}
        onChange={({ target }) => {
          setPasswordConfirm(target.value)
          checkPasswordMatch(password,target.value)
        }}
        className='user-form-input'
        style={{ backgroundColor: passwordMatch ? 'white' : 'yellow'}}
      />
      <div style={{ textAlign: 'right', marginTop: '10px' }}>
        <button className='toolbar-button' onClick={(event)=>{
          event.preventDefault()
          props.closeForm()
        }}>Cancel</button>
        <button className='toolbar-button' type='submit'>{props.newUser ? 'Create user' : 'Update user'}</button>                
      </div>
    </form>
  )
}
    
export default connect(mapStateToProps,mapDispatchToProps)(UsersForm)