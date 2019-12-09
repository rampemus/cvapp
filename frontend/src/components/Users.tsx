import React from 'react'
import './Users.css'

const Users: React.FC = (props) => {
    return(
        <div>
            <h1>Users</h1>
            <table>
                <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Created/Expires</th>
                    <th>Status</th>
                    <th></th>
                </tr>
                <tr>
                    <td>rampemus</td>
                    <td>Pasi Toivanen</td>
                    <td>2017-12-9 / -never- </td>
                    <td>Admin</td>
                    <td><button>Delete</button></td>
                </tr>
                <tr>   
                    <td>dannythedude</td>
                    <td>Danny Testing</td>
                    <td>2017-12-9 / 2017-12-9 </td>
                    <td>User</td>
                    <td><button>Delete</button></td>
                </tr>
            </table>
        </div>
    )
}

export default Users
