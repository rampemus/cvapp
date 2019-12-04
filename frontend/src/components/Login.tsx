import React from 'react'
import './Login.css'
import useField, { FieldType } from '../hooks/useField'
import loginService, { loginError } from '../services/loginService'

const Login: React.FC = (props) => {

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
                console.log('User logged in', response)
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

export default Login
