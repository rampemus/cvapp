import React from 'react'
import './Menu.css'
import { BrowserRouter as Router, Route, Link} from 'react-router-dom'

const Menu: React.FC = (props) => {

    return(
        <div className='Menu'>
            <div className='cv-app-logo'>
                logo here
            </div>
            <div className='menu-items'>
                <Link to='/'>
                    <div className='menu-item'>Curriculum Vitae</div>
                </Link>
                <Link to='/users'>
                    <div className='menu-item'>Users</div>
                </Link>
                <Link to='/mycv'>
                    <div className='menu-item'>MyCV</div>
                </Link>
                <Link to='/about'>
                    <div className='menu-item'>About</div>
                </Link>
            </div>
            <div className='settings'>
                <div className='setting-item'>language</div>
                <div className='setting-item'>logout</div>
            </div>
        </div>
    )
}

export default Menu
