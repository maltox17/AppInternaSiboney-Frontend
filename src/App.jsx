import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage'; 
import EmpleadoPage from './pages/EmpleadoPage'; 
import JefePage from './pages/JefePage';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (

    

    <>
    <Navbar />

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/empleado" element={<EmpleadoPage />} />
      <Route path="/jefe" element={<JefePage />} />
    </Routes>
    </>
  )
}

export default App