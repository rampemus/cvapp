import React, { useState } from 'react'
import './Login.css'
import useField, { FieldType } from '../hooks/useField'
import loginService, { loginError } from '../services/loginService'
import { setUser } from '../reducers/userReducer'
import { showNotification, Type } from '../reducers/notificationReducer'
import { updateCVs } from '../reducers/cvReducer'
import { connect } from 'react-redux'
import { setLoading } from '../reducers/loadingReducer'

interface OwnProps {}
interface StateProps {}
interface DispatchProps { showNotification: Function, setUser: Function, updateCVs: Function, setLoading: Function }

// const mapStateToProps = {}
const mapDispatchToProps: DispatchProps = {
  showNotification,
  setUser,
  updateCVs,
  setLoading
}

type Props = OwnProps & StateProps & DispatchProps

const Login: React.FC<Props> = (props) => {

  const username = useField( FieldType.TEXT )
  const password = useField( FieldType.PASSWORD )
  
  const [remember, setRemember] = useState(false)
  const [submitLock, setSubmitLock] = useState(false)

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.persist()
    event.preventDefault()

    props.setLoading(true)

    if (!submitLock) {
      loginService.login(username.value, password.value)
        .then(user => {
          props.setUser(user)
          remember && window.localStorage.setItem(
            'loggedUser', JSON.stringify(user)
          )
          props.showNotification('Login successful', Type.SUCCESS, 5)
          props.updateCVs(user)
          props.setLoading(false)
          props.setLoading(true)
        }).catch((error:loginError) => {
          if (error.response.data.error) {
            const cooldown = error.response.data.cooldownEnd && error.response.data.cooldownEnd / 1000
            if (cooldown) {
              props.showNotification(`${error.response.data.error}`, Type.WARNING, cooldown)
              setSubmitLock(true)
              const lock = setTimeout(() => {
                setSubmitLock(false)
                clearTimeout(lock)
                handleLogin(event)
              }, cooldown * 1000 + 700)
            } else {
              props.showNotification(`${error.response.data.error}`, Type.ERROR, 4) 
            }
          } else {
            props.showNotification(`No response from the server`, Type.ERROR, 4)
          }
        })
    }
  }

  return(<div className='Login'>
    <form onSubmit={handleLogin} className='loginBox'>
      <div>
        Username:
        <input disabled={submitLock} className='login-input' id='username' name='username' value='' {...username}>
        </input>
      </div>
      <div>
        Password:
        <input disabled={submitLock} className='login-input' id='password' name='password' value='' {...password}>
        </input>
      </div>
      <div className='rememberme'>
        Remember me
        <input id='RememberMeCheckbox' type='checkbox'
          defaultChecked={remember}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setRemember(!remember)
          }}
        />
      </div>
      <button id='login' type='submit' disabled={submitLock} className='login-button'>
        Login
      </button>
    </form>
  </div>)
}
export default connect(null, mapDispatchToProps)(Login)