import React, { useState, useEffect } from 'react'
import './App.css'
import Background from './HexaBackground'
import Menu from './components/Menu'
import Login from './components/Login'
import Footer from './components/Footer'
// import { ReactHeight } from 'react-height'

const App: React.FC = () => {

  const [ height, setHeight ] = useState(800)

  useEffect(()=>{
    const app = document.getElementById('App')
    if ( app ) {
      console.log(app.clientHeight)
    }
    
  },[Login])

  return (
    <div className="App" id="App">
      <Background/>
      <Menu />
      {/* <ReactHeight onHeightReady={(height:number) => console.log(height)}> */}
        <Login />
      {/* </ReactHeight> */}
      <Footer />
    </div>
  )
}

export default App
