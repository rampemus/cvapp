import './App.scss'
import About from './components/About'
import Background from './background/HexaBackground'
import Footer from './components/Footer'
import Home from './components/Home'
import Login from './components/Login'
import Menu from './components/Menu'
import MyCV from './components/MyCVForm/MyCV'
import NotificationArea from './components/Notification'
import React, { useState, useEffect } from 'react'
import Users from './components/Users/Users'
import { AppState } from '.'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { UserState } from './reducers/userReducer'
import { connect } from 'react-redux'
import { updateCVs } from './reducers/cvReducer'

interface OwnProps {
  updateStatus?: () => void
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
  const [height, setHeight] = useState(800)

  console.log('running in', process.env.NODE_ENV)

  useEffect(() => {
    const content = document.getElementById('content')
    if (content) {
      setHeight(content.clientHeight)
    }
    if (props.user && props.user.token.length > 0) {
      props.updateCVs(props.user)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const content = () => {
    props.updateStatus && props.updateStatus()
    if (!hideLogin) {
      return <div className='content'>
        <Login />
      </div>
    }
    return <div className='content'>
      <Route exact path='/'><Home /></Route>
      <Route path='/users'><Users /></Route>
      <Route path='/mycv'><MyCV /></Route>
      <Route path='/preview'><MyCV /></Route>
      <Route exact path='/about'><About /></Route>
    </div>
  }

  return <div className="App" id="App">
    <Router>
      <Menu showRoutes={!hideLogin} />
      <Background/>
      {content()}
      <NotificationArea />
      <Footer />
      <Background bottom />
    </Router>
  </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
