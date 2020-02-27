import React, { useState } from 'react'
import { showNotification, Type } from '../reducers/notificationReducer'
import { connect } from 'react-redux'
import usersService, { usersError } from '../services/usersService'

interface OwnProps {
    closeForm: Function,
    reloadUsers: Function
}
export interface StateProps {}
export interface DispatchProps {
    showNotification: Function
}

const mapDispatchToProps: DispatchProps = {
    showNotification
}

type Props = OwnProps & StateProps & DispatchProps

const UsersForm: React.FC<Props> = (props) => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [expires, setExpires] = useState<Date | null>(null)
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    enum CalcDate {
        TWO_WEEKS = Date.now() + 1000 * 60 * 60 * 24 * 14,
        ONE_MONTH = Date.now() + 1000 * 60 * 60 * 24 * 30
    }

    const handleCreateUser = (event: any) => {
        event.preventDefault()

        if ( password === passwordConfirm ) {
            usersService.createUser(username, name, password, expires).then(
                response => {
                    setName('')
                    setUsername('')
                    setExpires(null)
                    setPassword('')
                    setPasswordConfirm('')
                    props.showNotification(`User ${response.data.name} was created`, Type.SUCCESS, 4)
                    props.reloadUsers()
                    props.closeForm()
                }
            ).catch((error: usersError) => props.showNotification(error.response.data.error, Type.ERROR, 5))
        } else {
            props.showNotification('Password and password confirmation does not match', Type.WARNING, 4)
        }
    }

    const [passwordMatch, setPasswordMatch] = useState(true)

    const checkPasswordMatch = (password1: string, password2:string) => {
        setPasswordMatch(password1 === password2)
    }

    return(
        <form onSubmit={handleCreateUser} autoComplete='off'>
            Create new custom user
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
            <p>User is valid</p>
            <div>
                <input type="radio" name="expires" onClick={ () => setExpires(new Date(CalcDate.TWO_WEEKS)) }/> a fortnight
                <input type="radio" name="expires" onClick={ () => setExpires(new Date(CalcDate.ONE_MONTH)) } /> a month
                <input type="radio" name="expires" onClick={ () => setExpires(null) } /> forever
            </div>
            <p>Password for new user</p> 
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
                style={{ backgroundColor: passwordMatch ? 'white' : 'yellow' }}
            />
            <p>Confirm password</p>
            <input
                type='password'
                value={passwordConfirm}
                onChange={
                    ({ target }) => {
                        setPasswordConfirm(target.value)
                        checkPasswordMatch(password,target.value)
                    }
                }
                className='user-form-input'
                style={{ backgroundColor: passwordMatch ? 'white' : 'yellow'}}
            />
            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <button className='toolbar-button' onClick={(event)=>{
                    event.preventDefault()
                    props.closeForm()
                }}>Cancel</button>
                <button className='toolbar-button' type='submit'>Create user</button>                
            </div>
        </form>
    )
}

export default connect(null,mapDispatchToProps)(UsersForm)