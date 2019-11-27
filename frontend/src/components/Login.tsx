import React from 'react'
import './Login.css'
import useField, { FieldType } from '../hooks/useField'

const Login: React.FC = (props) => {

    const username = useField( FieldType.TEXT )
    const password = useField( FieldType.PASSWORD )

    const handleLogin = () => {
        console.log('Sending login...')
    }

    return(
        <div className='Login'>
            <form onSubmit={handleLogin} className='loginBox'>
                <div>Username: <input id='username' name='username' {...username}></input></div>
                <div>Password: <input id='password' name='password' {...password}></input></div>
                <button>Login</button>
            </form>
        </div>
    )
}

export default Login
