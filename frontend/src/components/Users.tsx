import React from 'react'
import './Users.css'
import UsersRow from './UsersRow'

export interface User {
    name: string,
    username: string,
    id: string,
    created: Date,
    expires: Date,
}

const rootUser: User = {
    name: 'Pasi Toivanen',
    username: 'rampemus',
    id: 'rootid',
    created: new Date(),
    expires: new Date()
}

const handleUserDelete = (id:string) => {
    console.log('Delete of the user id ', id, ' was requested')
}

const Users: React.FC = (props) => {
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
                    <UsersRow user={rootUser} handleUserDelete={()=>handleUserDelete(rootUser.id)}/>
                    <tr>   
                        <td>dannythedude</td>
                        <td>Danny Testing</td>
                        <td>2017-12-9 / 2017-12-9 </td>
                        <td>User</td>
                        <td><button>Delete</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Users
