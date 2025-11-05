import React from 'react'
import {Routes, Route} from 'react-router-dom'
import MainContent from './MainContent'
import LeftContent from './LeftContent'
import '../styles/Dashboard.css'
import LoginForm from './LoginForm'
import Inventory from './Inventory'

const Dashboard = () => {
  return (
    <div className='main-container'>
    <div className='left-div'>
        <LeftContent/>
    </div>
    <div className="right-div">
        <Routes>
          <Route path='/' element={<MainContent/>} />
          <Route path='/login' element={<LoginForm/>} />
          <Route path='/inventory' element={<Inventory/>} />
        </Routes>
    </div>
    </div>
  )
}

export default Dashboard