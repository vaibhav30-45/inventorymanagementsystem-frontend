import React from 'react'
import '../styles/LeftContent.css'
import { useNavigate } from 'react-router-dom';

const LeftContent = () => {
  let navigate = useNavigate();
  return (
    <div className='buttons-container'>
      <button onClick={() => navigate('/login')}>Login</button>
      <button onClick={() => navigate('/inventory')}>inventory</button>
    </div>
  )
}

export default LeftContent