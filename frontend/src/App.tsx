import React, { useState, useEffect } from 'react'
import './App.css'
import Background from './background/HexaBackground'
import Menu from './components/Menu'
import Login from './components/Login'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route } from 'react-router-dom'

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
      <div className='content'>
        {()=>{

        }}
          <Route exact path='/'><Login/></Route>
      </div>
      <Footer />
      </Router>
    </div>
  )
}

export default App
