import React from 'react'
import './Menu.css'

const Menu: React.FC = (props) => {


    return(
        <div className='Menu'>
            <div className='cv-app-logo'>
                logo here
            </div>
            <div className='menu-items'>
                <div className='menu-item'>Curriculum Vitae</div>
                <div className='menu-item'>Users</div>
                <div className='menu-item'>MyCV</div>
            </div>
            <div className='settings'>
                <div className='setting-item'>language</div>
                <div className='setting-item'>logout</div>
            </div>
        </div>
    )
}

export default Menu
