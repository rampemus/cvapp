import React, { useState, useEffect } from 'react'
import './Users.css'
import UsersRow from './UsersRow'
import usersService, { IUser, usersError } from '../services/usersService'

const handleUserDelete = (id:string) => {
    console.log('Delete of the user id ', id, ' was requested')
}

const Users: React.FC = (props) => {
    const [users, setUsers] = useState<IUser[]>([])
    
    useEffect(()=>{
        usersService.getAll().then(response => {
            setUsers(response)
            console.log('Users', response)
        }).catch((error:usersError) => console.log(error.response.data.error))
    },[])

    return(
        <div>
            <h1>Users</h1>
            <table>
                <tbody>
                    <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Created/Expires</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                    {users.map(user => {
                        return (
                            <UsersRow key={'usersrow' + user.id} user={user} handleUserDelete={()=>handleUserDelete(user.id)}/>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Users
