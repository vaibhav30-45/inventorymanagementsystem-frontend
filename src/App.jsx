import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import Inventory from './components/Inventory'
import LoginForm from './components/LoginForm'
import Sales from './components/Sales'

function App() {
  return (
    <>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </>
  )
}

export default App
