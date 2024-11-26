import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage'; 
import TrabajadorPage from './pages/TrabajadorPage'; 
import JefePage from './pages/JefePage';
import EmpleadosPage from './pages/EmpleadosPage';
import CentrosPage from './pages/CentrosPage';
import CalendarioVacacionesPage from './pages/CalendarioVacacionesPage';
import SolicitudVacacionesPage from './pages/SolicitudVacacionesPage';
import TrabajadorHorarioPage from './pages/TrabajadorHorarioPage';
import EmpleadosCentroPage from './pages/EmpleadosCentroPage';
import AprobarVacacionesPage from './pages/AprobarVacacionesPage';
import EmpleadoPage from './pages/EmpleadoPage';
import HorariosPage from './pages/HorariosPage';
import HorariosEstablecidosPage from './pages/HorariosEstablecidosPage';
import EncargadoHorariosPage from './pages/EncargadoHorariosPage';
import HorasExtrasJefePage from './pages/HorasExtrasJefePage';
import HorasExtrasEmpleadoPage from './pages/HorasExtrasEmpleadoPage';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (

      <>
        <Navbar />

        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas para "ROLE_JEFE" */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_JEFE']} />}>
            <Route path="/jefe" element={<JefePage />} />
            <Route path="/jefe/empleados" element={<EmpleadosPage />} />
            <Route path="/jefe/centros" element={<CentrosPage />} />
            <Route path="/jefe/vacaciones/solicitudes" element={<AprobarVacacionesPage />} />
            <Route path="/jefe/horarios/calendarios" element={<HorariosPage />} />
            <Route path="/jefe/horariosEstablecidos" element={<HorariosEstablecidosPage />} />
            <Route path="/jefe/empleadosCentro" element={<EmpleadosCentroPage />} />
            <Route path="/jefe/empleados/:idEmpleado" element={<EmpleadoPage />} />
            <Route path="jefe/horasExtras" element={<HorasExtrasJefePage />} />
          </Route>

          {/* Rutas protegidas para "ROLE_ENCARGADO" */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_ENCARGADO']} />}>
            <Route path="/empleado/encargado/horarios" element={<EncargadoHorariosPage />} />
          </Route>

          {/* Rutas protegidas para cualquier rol */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_CAMARERO', 'ROLE_COCINERO', 'ROLE_ENCARGADO']} />}>
            <Route path="/empleado" element={<TrabajadorPage />} />
            <Route path="/empleado/vacaciones" element={<SolicitudVacacionesPage />} />
            <Route path="/vacaciones/calendario" element={<CalendarioVacacionesPage />} />
            <Route path="/empleado/horario" element={<TrabajadorHorarioPage />} />
            <Route path="empleado/horasExtras" element={<HorasExtrasEmpleadoPage />} />
          </Route>
        </Routes>
      </>

  );
}

export default App;
