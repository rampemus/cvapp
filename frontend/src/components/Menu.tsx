import './Menu.scss'
import React from 'react'
import { AppState } from '..'
import { Link, useLocation } from 'react-router-dom'
import { clearCVS } from '../reducers/cvReducer'
import { connect, ConnectedProps } from 'react-redux'
import { logoutUser } from '../reducers/userReducer'

interface OwnProps {
  showRoutes: boolean
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    user: state.user,
    lastOpenedCV: state.cv.lastOpened,
    loading: state.loader.isFetching
  }
}

const mapDispatchToProps = {
  logoutUser,
  clearCVS
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

const Menu: React.FC<Props> = (props) => {

  const location = useLocation()

  const showLogout = props.user && props.user.token.length > 2
  const renderLogout = () => {
    if (showLogout) {
      return <Link to='/'><button id='Logout' className='setting-item logout-button' onClick={() => {
        props.logoutUser()
        props.clearCVS()
      }}>
        <img src='logout.svg' width='17px' height='15px' alt='out' />
        logout
        </button>
      </Link>
    }
    return <button disabled className='setting-item logout-button'>
      <img className='icon' src='logout.svg' width='17px' height='15px' alt='out' />
      <div>logout</div>
    </button>
  }
  if (!props.showRoutes) {
    return <div className='Menu'>
      <div className='cv-app-logo'>
        <img src='./logo.svg' width='38px' height='38px' alt='logo' />
      </div>
      <div className='menu-items'>
        <Link id='CurriculumVitae' to='/'>
          <div className={location.pathname === '/'
            ? 'menu-item selected'
            : 'menu-item'}>Curriculum Vitae</div>
        </Link>
        <Link id='Users' to='/users'>
          <div className={location.pathname.includes('/users')
            ? 'menu-item selected'
            : 'menu-item'}>Users</div>
        </Link>
        <Link id='MyCV' to={`/mycv${props.lastOpenedCV.length > 1 ? '/' + props.lastOpenedCV : ''}`}>
          <div className={location.pathname.includes('/mycv')
            ? 'menu-item selected'
            : 'menu-item'}>MyCV</div>
        </Link>
        <Link id='About' to='/about'>
          <div className={location.pathname === '/about'
            ? 'menu-item selected'
            : 'menu-item'}>About</div>
        </Link>
      </div>
      <div className='settings'>
        {renderLogout()}
      </div>
    </div>

  }
  return <div className='Menu'>
    <div className='cv-app-logo'>
      <img src='logo.svg' width='38px' height='38px' alt='logo' />
    </div>
  </div>

}

export default connector(Menu)
