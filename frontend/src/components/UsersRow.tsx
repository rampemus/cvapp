import React, { useState } from 'react'
import { IUser } from '../services/usersService'
import { Link } from 'react-router-dom'

interface Props {
    user: IUser,
    handleUserDelete: Function
}

const UsersRow: React.FC<Props> = (props) => {
    const { name, username, id, created, expires } = props.user

    const [hovered, setHovered] = useState<boolean>(false)

    return (
        <tr key={'usertr' + id} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <td><Link to={`/users/${username}`}>{username}</Link></td>
            <td>{name}</td>
            <td>{created.toString().substring(0, 10)} / {expires ? expires.toString().substring(0, 10) : '-never-'}</td>
            <td>{username === 'rampemus' ? 'Admin' : 'User'}</td>
            <td style={{ opacity: hovered ? 1 : 0 }}><button onClick={()=>props.handleUserDelete()}>Delete</button></td>
        </tr>
    )
}

export default UsersRow