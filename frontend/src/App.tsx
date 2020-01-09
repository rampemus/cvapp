import React, { useState, useEffect } from 'react'
import './App.css'
import Background from './background/HexaBackground'
import Menu from './components/Menu'
import Login from './components/Login'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import { ReactHeight } from './utils/react-height'
import Users from './components/Users'
import About from './components/About'
import MyCV from './components/MyCV'
import NotificationArea from './components/NotificationArea'
import { connect } from 'react-redux'
import { AppState } from '.'
import { UserState } from './reducers/userReducer'

interface OwnProps { }
export interface StateProps { user?: UserState }
export interface DispatchProps { }

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    user: state.user
  }
}

// const mapDispatchToProps = { }

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
  },[])

  const content = () => {
    if (!hideLogin) {
      return (
        <div className='content'>
          <Login />
        </div>
      )
    }
    return (
      <div className='content'>
        <Route exact path='/'><h1>Home page</h1></Route>
        <Route path='/users'><Users /></Route>
        <Route path='/mycv'><MyCV /></Route>
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
      </Router>
    </div>
  )
}


export default connect(mapStateToProps,null)(App)