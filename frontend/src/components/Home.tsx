import React from 'react'
import './Preview.css'

const Home: React.FC = (props) => {
    return(
        <div className='cv-container'>
            <h1>Curriculum Vitae</h1>
            <div className='cv-container-item cv-container-item-first'>
                <p>
                    GitHub:
                </p>
                <p>
                    TechList:
                </p>
            </div>

            <div className='cv-container-item-left'>
                <h3>Profile</h3>
                <hr />
            </div>
            <div className='cv-container-item-right'>
                <h3>Projects</h3>
                <hr />
            </div>
            <div className='cv-container-item'>
                <h3>References</h3>
                <hr />

            </div>
            <div className='cv-container-item'>
                <h3>Education</h3>
                <hr />

            </div>
            <div className='cv-container-item'>
                <h3>Communication</h3>
                <hr />

            </div>
            <div className='cv-container-item'>
                <h3>Other Skills</h3>
                <hr />

            </div>
            <div className='cv-container-item'>
                <h3>Attachments</h3>
                <hr />

            </div>
        </div>
    )
}

export default Home
