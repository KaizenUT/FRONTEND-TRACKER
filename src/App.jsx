import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import BibliotecaJuegos from './pages/BibliotecaJuegos';
import EstadisticasPersonales from './pages/EstadisticasPersonales';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-logo">
              <span className="logo-icono">🎮</span>
              <span className="logo-texto">GameTracker</span>
            </div>
            
            <div className="navbar-menu">
              <Link to="/FRONTEND-TRACKER/" className="nav-btn">
                📚 Mi Biblioteca
              </Link>
              <Link to="/FRONTEND-TRACKER/estadisticas" className="nav-btn">
                📊 Estadísticas
              </Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/FRONTEND-TRACKER/" element={<BibliotecaJuegos />} />
            <Route path="/FRONTEND-TRACKER/estadisticas" element={<EstadisticasPersonales />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;