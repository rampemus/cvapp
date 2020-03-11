import React from 'react'
import Toolbar from '../Toolbar'
import { IUser } from '../../services/usersService'

interface OwnProps {
    user?: IUser
}

const User: React.FC<OwnProps> = (props) => {
    const user = props.user

    if (!user) {
        return <div>User not found</div>
    }
    return(
        <div>
            <Toolbar>
                <div>
                    <button className='toolbar-button'>
                        Edit user
                    </button>
                </div>
            </Toolbar>
            <h1>{user.username}</h1>
        </div>
    )
}

export default User
