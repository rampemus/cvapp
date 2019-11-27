import React, { useState, useEffect } from 'react'
import './App.css'
import Background from './background/HexaBackground'
import Menu from './components/Menu'
import Login from './components/Login'
import Footer from './components/Footer'

const App: React.FC = () => {

  const [ height, setHeight ] = useState(800)

  useEffect(()=>{
    const content = document.getElementById('content')
    if ( content ) {
      console.log(content.clientHeight)
      setHeight(content.clientHeight)
    }
    
  },[])

  return ( 
    <div className="App" id="App">
      <Menu />
      <Background height={height}/>
      <div className='content'>
        <Login />
      </div>
      <Footer />
    </div>
  )
}

export default App
