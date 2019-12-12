import React, { useState } from 'react'
import { showNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'

const handleCreateUser = (event:any) => {
    event.preventDefault()
    console.log('User needs to be created')
}

interface OwnProps {
    closeForm: Function
}
export interface StateProps {}
export interface DispatchProps {}

const mapDispatchToProps: DispatchProps = {
    showNotification
}

type Props = OwnProps & StateProps & DispatchProps

const UsersForm: React.FC<Props> = (props) => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    

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
            <p>User is valid for</p>
            <div>
                <input type="radio" name="lifetime" value="1hour" /> hour
                <input type="radio" name="lifetime" value="2weeks" /> fortnight
                <input type="radio" name="lifetime" value="1month" /> month
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
                <button className='toolbar-button' onClick={()=>props.closeForm()}>Cancel</button>
                <button className='toolbar-button' type='submit'>Create user</button>                
            </div>
        </form>
    )
}

export default connect(null,mapDispatchToProps)(UsersForm)