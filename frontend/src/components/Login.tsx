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
        console.log('Sending login...')

        loginService.login(username.value, password.value)
            .then(response => {
                window.localStorage.setItem(
                    'loggedUser', JSON.stringify(response)
                )
                props.setUser(response)
                props.showNotification('Login successful', Type.SUCCESS)
                console.log('showNotification used', response)
            }).catch((error:loginError) => {
                if (error.response.data.error ) {
                    console.log('Error:', error.response.data.error)
                } else {
                    console.log('No response from server')
                }
            })
    }

    return(
        <div className='Login'>
            <form onSubmit={handleLogin} className='loginBox'>
                <div>Username: <input id='username' name='username' value='' {...username}></input></div>
                <div>Password: <input id='password' name='password' value='' {...password}></input></div>
                <button type='submit' className='login-button'>Login</button>
            </form>
        </div>
    )
}
export default connect(null, mapDispatchToProps)(Login)