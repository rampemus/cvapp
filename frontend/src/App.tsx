import React, { useState, useEffect } from 'react'
import './App.css'
import Background from './background/HexaBackground'
import Menu from './components/Menu'
import Login from './components/Login'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import { ReactHeight } from './utils/react-height'
import Users from './components/Users/Users'
import About from './components/About'
import MyCV from './components/MyCVForm/MyCV'
import NotificationArea from './components/Notification'
import { connect } from 'react-redux'
import { AppState } from '.'
import { UserState } from './reducers/userReducer'
import { updateCVs } from './reducers/cvReducer'
import Home from './components/Home'

interface OwnProps {
  updateStatus?: Function
}
export interface StateProps { user: UserState }
export interface DispatchProps {
  updateCVs: (user: UserState) => void
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps: DispatchProps = {
  updateCVs
}

type Props = OwnProps & StateProps & DispatchProps

const App: React.FC<Props> = (props) => {
  const { user } = props
  const hideLogin = user && user.token.length > 2
  const [ height, setHeight ] = useState(800)

  useEffect(()=>{
    const content = document.getElementById('content')
    if ( content ) {
      setHeight(content.clientHeight)
    }
    if (props.user && props.user.token.length > 0) {
      props.updateCVs(props.user)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const content = () => {
    props.updateStatus && props.updateStatus()
    if (!hideLogin) {
      return (
        <div className='content'>
          <Login />
        </div>
      )
    }
    return (
      <div className='content'>
        <Route exact path='/'><Home /></Route>
        <Route path='/users'><Users /></Route>
        <Route path='/mycv'><MyCV /></Route>
        <Route path='/preview'><MyCV /></Route> 
        <Route exact path='/about'><About /></Route>
      </div>
    )
  }

  return ( 
    <div className="App" id="App">
      <Router>
      <Menu showRoutes={!hideLogin}/>
      <Background height={height}/>
        {/* <ReactHeight onHeightReady={(h:any) => setHeight(h)}> */}
        {content()}
        {/* </ReactHeight> */}
      <NotificationArea/>
      <Footer/>
      <Background height={height} bottom/>
      </Router>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(App)