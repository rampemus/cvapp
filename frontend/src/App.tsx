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

const App: React.FC = () => {

  const [ height, setHeight ] = useState(800)

  useEffect(()=>{
    const content = document.getElementById('content')
    if ( content ) {
      setHeight(content.clientHeight)
    }
  },[])

  return ( 
    <div className="App" id="App">
      <Router>
      <Menu />
      <Background height={height}/>
        {/* <ReactHeight onHeightReady={(h:any) => setHeight(h)}> */}
          <div className='content'>
            <Route exact path='/'><Login/></Route>
            <Route path='/users'><Users/></Route>
            <Route path='/mycv'><MyCV/></Route>
            <Route exact path='/about'><About/></Route>
          </div>
        {/* </ReactHeight> */}
      <Footer />
      </Router>
    </div>
  )
}

export default App
