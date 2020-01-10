import React from 'react'
import './Menu.css'
import { Link, useLocation } from 'react-router-dom'
import { UserState, logoutUser } from '../reducers/userReducer'
import { AppState } from '..'
import { connect } from 'react-redux'

interface OwnProps {
    showRoutes: boolean
}
export interface StateProps { user: UserState }
export interface DispatchProps { logoutUser: Function }

const mapStateToProps = (state: AppState, props: OwnProps) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps:DispatchProps = {
    logoutUser
}

type Props = OwnProps & StateProps & DispatchProps

const Menu: React.FC<Props> = (props) => {

    const location = useLocation()

    const showLogout = props.user && props.user.token.length > 2
    const renderLogout = () => {
        if (showLogout) {
            return (<button onClick={() => props.logoutUser()}><div className='setting-item logout-button'>logout</div></button>)
        }
        return (<button disabled className='setting-item logout-button'>logout</button>)
    }
    if (!props.showRoutes) {
        return (
            <div className='Menu'>
                <div className='cv-app-logo'>
                    <img src='./logo.svg' width='38px' height='38px' alt='logo'/>
                </div>
                <div className='menu-items'>
                    <Link to='/' >
                        <div className={location.pathname === '/' ? 'menu-item selected' : 'menu-item'}>Curriculum Vitae</div>
                    </Link>
                    <Link to='/users'>
                        <div className={location.pathname === '/users' ? 'menu-item selected' : 'menu-item'}>Users</div>
                    </Link>
                    <Link to='/mycv'>
                        <div className={location.pathname.includes('/mycv') ? 'menu-item selected' : 'menu-item'}>MyCV</div>
                    </Link>
                    <Link to='/about'>
                        <div className={location.pathname === '/about' ? 'menu-item selected' : 'menu-item'}>About</div>
                    </Link>
                </div>
                <div className='settings'>
                    <div className='setting-item'>language</div>
                    {renderLogout()}
                </div>
            </div>
        )
    }
    return(
        <div className='Menu'>
            <div className='cv-app-logo'>
                <img src='./logo.svg' width='38px' height='38px' alt='logo'/>
            </div>
        </div>
    )
}

export default connect(mapStateToProps,mapDispatchToProps)(Menu)