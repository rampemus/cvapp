import React, { useState } from 'react'
import './Login.css'
import useField, { FieldType } from '../hooks/useField'
import loginService, { loginError } from '../services/loginService'
import { setUser } from '../reducers/userReducer'
import { showNotification, Type } from '../reducers/notificationReducer'
import { updateCVs } from '../reducers/cvReducer'
import { connect } from 'react-redux'

interface OwnProps {}
interface StateProps {}
interface DispatchProps { showNotification: Function, setUser: Function, updateCVs: Function }

// const mapStateToProps = {}
const mapDispatchToProps: DispatchProps = {
    showNotification,
    setUser,
    updateCVs
}

type Props = OwnProps & StateProps & DispatchProps

const Login: React.FC<Props> = (props) => {

    const username = useField( FieldType.TEXT )
    const password = useField( FieldType.PASSWORD )
    
    const [remember, setRemember] = useState(false)
    const [submitLock, setSubmitLock] = useState(false)

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!submitLock) {
            loginService.login(username.value, password.value)
                .then(response => {
                    props.setUser(response)
                    remember && window.localStorage.setItem(
                        'loggedUser', JSON.stringify(response)
                    )
                    props.showNotification('Login successful', Type.SUCCESS, 5)
                    props.updateCVs(response)
                }).catch((error:loginError) => {
                    if (error) {
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
                        props.showNotification(`Error no response from server`, Type.ERROR, 4)
                    }
                })
        }
    }

    return(
        <div className='Login'>
            <form onSubmit={handleLogin} className='loginBox'>
                <div>Username: <input disabled={submitLock} className='login-input' id='username' name='username' value='' {...username}></input></div>
                <div>Password: <input disabled={submitLock} className='login-input' id='password' name='password' value='' {...password}></input></div>
                <div className='rememberme'>Remember me<input type='checkbox' defaultChecked={remember} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setRemember(!remember)
                }}/></div>
                <button type='submit' disabled={submitLock} className='login-button'>Login</button>
            </form>
        </div>
    )
}
export default connect(null, mapDispatchToProps)(Login)