import React from 'react'
import './Login.css'
import useField, { FieldType } from '../hooks/useField'
import loginService, { loginError } from '../services/loginService'
import { setUser } from '../reducers/userReducer'
import { showNotification, Type } from '../reducers/notificationReducer'
import { connect } from 'react-redux'

interface OwnProps {}
interface StateProps {}
interface DispatchProps { showNotification: Function, setUser: Function }

// const mapStateToProps = {}
const mapDispatchToProps: DispatchProps = {
    showNotification,
    setUser
}

type Props = OwnProps & StateProps & DispatchProps

const Login: React.FC<Props> = (props) => {

    const username = useField( FieldType.TEXT )
    const password = useField( FieldType.PASSWORD )

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        loginService.login(username.value, password.value)
            .then(response => {
                window.localStorage.setItem(
                    'loggedUser', JSON.stringify(response)
                )
                props.setUser(response)
                props.showNotification('Login successful', Type.SUCCESS, 4)
            }).catch((error:loginError) => {
                if (error.response.data.error ) {
                    props.showNotification(`Error ${error.response.data.error}`, Type.ERROR, 4)
                } else {
                    props.showNotification(`Error no response from server`, Type.ERROR, 4)
                }
            })
    }

    return(
        <div className='Login'>
            <form onSubmit={handleLogin} className='loginBox'>
                <div>Username: <input className='login-input' id='username' name='username' value='' {...username}></input></div>
                <div>Password: <input className='login-input' id='password' name='password' value='' {...password}></input></div>
                <button type='submit' className='login-button'>Login</button>
            </form>
        </div>
    )
}
export default connect(null, mapDispatchToProps)(Login)