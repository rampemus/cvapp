import React, { useState, useEffect } from 'react'
import './App.css'
import Background from './background/HexaBackground'
import Menu from './components/Menu'
import Login from './components/Login'
import Footer from './components/Footer'

const App: React.FC = () => {

  const [ height, setHeight ] = useState(800)

  useEffect(()=>{
    const app = document.getElementById('App')
    if ( app ) {
      console.log(app.clientHeight)
      setHeight(app.clientHeight)
    }
    
  },[])

  return (
    <div className="App" id="App">
      <Background height={height}/>
      <Menu />
        <Login />
      <Footer />
    </div>
  )
}

export default App
