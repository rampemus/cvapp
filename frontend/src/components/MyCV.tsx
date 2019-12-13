import React from 'react'
import Toolbar from './Toolbar'

const MyCV: React.FC = (props) => {


    return(
        <div>
            <Toolbar>
                <div>
                    <button className='toolbar-button'>Clear CV</button>
                    <button className='toolbar-button'>Duplicate Default CV</button>
                    <button className='toolbar-button'>Set As Default CV</button>
                    <button className='toolbar-button'>Preview</button>
                </div>
            </Toolbar>
            <h1>Create and edit CV's</h1>
            <h3>Name of the cv</h3>
            <h3>Info</h3>
            <h3>Contact</h3>
            <h3>Profile</h3>
            <h3>References</h3>
            <h3>Education</h3>
            <h3>Communication</h3>
            <h3>Other Skills</h3>
            <h3>Attachments</h3>
        </div>
    )
}

export default MyCV
