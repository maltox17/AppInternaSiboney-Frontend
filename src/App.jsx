import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage'; 
import TrabajadorPage from './pages/TrabajadorPage'; 
import JefePage from './pages/JefePage';
import EmpleadosPage from './pages/EmpleadosPage';
import CentrosPage from './pages/CentrosPage'
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
      <Route path="/empleado" element={<TrabajadorPage />} />
      <Route path="/jefe" element={<JefePage />} />
      <Route path="/jefe/empleados" element={<EmpleadosPage />} />
      <Route path="/jefe/centros" element={<CentrosPage />} />
    </Routes>
    </>
  )
}

export default App