import React, { useState } from 'react'
import { showNotification, Type } from '../reducers/notificationReducer'
import { connect } from 'react-redux'
import usersService, { usersError } from '../services/usersService'

interface OwnProps {
    closeForm: Function
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

        usersService.createUser(username, name, password, expires).then(
            response => {
                setName('')
                setUsername('')
                setExpires(null)
                setPassword('')
                setPasswordConfirm('')
                props.showNotification(`User ${response.data.name} was created`, Type.SUCCESS, 4)
                props.closeForm()
            }
        ).catch((error: usersError) => props.showNotification(error.response.data.error, Type.ERROR, 5))
    }

    return(
        <form onSubmit={handleCreateUser}>
            Add new user with custom parameters
            <p>Full name</p> 
            <input
                type='text'
                value={name}
                onChange={
                    ({ target }) => setName(target.value)
                }
            />
            <p>Username</p> 
            <input
                type='text'
                value={username}
                onChange={
                    ({ target }) => setUsername(target.value)
                }
            />
            <p>User is valid</p>
            <div>
                <input type="radio" name="expires" onClick={ () => setExpires(new Date(CalcDate.TWO_WEEKS)) }/> a fortnight
                <input type="radio" name="expires" onClick={ () => setExpires(new Date(CalcDate.ONE_MONTH)) } /> a month
                <input type="radio" name="expires" onClick={ () => setExpires(null) } /> forever
            </div>
            <p>Password</p> 
            <input
                type='password'
                value={password}
                onChange={
                    ({ target }) => setPassword(target.value)
                }
            />
            <p>Confirm password</p>
            <input
                type='password'
                value={passwordConfirm}
                onChange={
                    ({ target }) => setPasswordConfirm(target.value)
                }
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