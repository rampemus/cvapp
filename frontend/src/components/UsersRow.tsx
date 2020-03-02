import React from 'react'
import { IUser } from '../services/usersService'
import { Link } from 'react-router-dom'

interface Props {
    user: IUser,
    handleUserDelete: Function
}

const UsersRow: React.FC<Props> = (props) => {
    const { name, username, id, created, expires } = props.user

    return (
        <tr key={'usertr' + id}>
            <td><Link to={`/users/${username}`}>{username}</Link></td>
            <td>{name}</td>
            <td>{created.toString().substring(0, 10)} / {expires ? expires.toString().substring(0, 10) : '-never-'}</td>
            <td>{username === 'rampemus' ? 'Admin' : 'User'}</td>
            <td><button onClick={() => props.handleUserDelete()}><img className='icon' src='delete.svg' width='17px' height='15px' alt='delete' />Delete</button></td>
        </tr>
    )
}

export default UsersRow