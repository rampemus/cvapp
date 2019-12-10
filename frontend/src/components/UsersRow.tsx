import React from 'react'
import { User } from './Users'

interface Props {
    user: User,
    handleUserDelete: Function
}

const UsersRow: React.FC<Props> = (props) => {
    const { name, username, id, created, expires } = props.user

    return (
        <tr key={id}>
            <td>{username}</td>
            <td>{name}</td>
            <td>{created.toString()} / {expires.toString()}</td>
            <td>Admin</td>
            <td><button onClick={()=>props.handleUserDelete()}>Delete</button></td>
        </tr>
    )
}

export default UsersRow