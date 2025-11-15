import React, { useState, useEffect } from 'react';
import TarjetaJuego from '../components/TarjetaJuego';
import DetalleJuego from '../components/DetalleJuego';
import FormularioJuego from '../components/FormularioJuego';
//Las funciones que hacen las peticiones al backend
import { obtenerJuegos, crearJuego, actualizarJuego, eliminarJuego } from '../services/api';
import './BibliotecaJuegos.css';

// UseState para manejar nuestros múltiples estados
const BibliotecaJuegos = () => {
  const [juegos, setJuegos] = useState([]); //Guarda la lista de juegos
  const [cargando, setCargando] = useState(true); //Indica si está cargando (true) o ya cargó (false) por si acaso
  const [mostrarFormulario, setMostrarFormulario] = useState(false); //Verifica si se esta mostrando el formulario
  const [juegoEditar, setJuegoEditar] = useState(null); //Guarda el juego que se está editando
  const [filtro, setFiltro] = useState('todos'); //Controla el filtro activo : 'todos', 'completados', 'pendientes'


  const [juegoDetalle, setJuegoDetalle] = useState(null); //Guarda el ID del juego para mostrar detalles
  const [busqueda, setBusqueda] = useState(''); //Guarda el texto de búsqueda

  // Cargar juegos al iniciar
  useEffect(() => {
    cargarJuegos();
  }, []);

  const cargarJuegos = async () => {
    try {
      setCargando(true);
      const response = await obtenerJuegos();
      setJuegos(response.data);
    } catch (error) {
      console.error('Error al cargar juegos:', error);
      alert('Error al cargar los juegos');
    } finally {
      setCargando(false);
    }
  };

  //Agregar juego
  const handleAgregarJuego = () => {
    setJuegoEditar(null); // No hay juego a editar
    setMostrarFormulario(true); //Muestra el formulario vacío
  };

  const handleEditarJuego = (juego) => {
    setJuegoEditar(juego); // Si hay juego a editar
    setMostrarFormulario(true); // Muestra el formulario con datos
  };

  const handleSubmitFormulario = async (formData) => {
    try {
      if (juegoEditar) {
        // Editar juego existente
        await actualizarJuego(juegoEditar._id, formData);
        alert('✅ Juego actualizado exitosamente');
      } else {
        // Crear nuevo juego
        await crearJuego(formData);
        alert('✅ Juego agregado exitosamente');
      }
      
      setMostrarFormulario(false);
      setJuegoEditar(null);
      cargarJuegos(); // Recargar la lista
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al guardar el juego');
    }
  };

  const handleEliminarJuego = async (id) => {
      if (window.confirm('¿Estás seguro de eliminar este juego?')) {
          try {
              await eliminarJuego(id);  // Elimina del backend
              alert('✅ Juego eliminado exitosamente');
              cargarJuegos();  // Recarga la lista
          } catch (error) {
              console.error('Error al eliminar:', error);
              alert('❌ Error al eliminar el juego');
          }
      }
  };

  const handleVerDetalles = (id) => {
    setJuegoDetalle(id); //Para guardar id y mostrar detalles
  };

// Filtrar juegos por estado (completado/pendiente)
const juegosFiltrados = juegos.filter(juego => {
  if (filtro === 'completados') return juego.completado; // Solo completados
  if (filtro === 'pendientes') return !juego.completado; // Solo pendientes
  return true;
});

// Filtrar por búsqueda
const juegosFinales = juegosFiltrados.filter(juego => {
  if (!busqueda) return true; // Si no hay búsqueda nos muestra todos
  
  const searchLower = busqueda.toLowerCase();
  return (
    juego.titulo.toLowerCase().includes(searchLower) ||
    juego.genero.toLowerCase().includes(searchLower) ||
    juego.plataforma.toLowerCase().includes(searchLower) ||
    juego.desarrollador.toLowerCase().includes(searchLower)
  );
});

  // Estadísticas
  const totalJuegos = juegos.length;
  const juegosCompletados = juegos.filter(j => j.completado).length;
  const juegosPendientes = totalJuegos - juegosCompletados;

if (cargando) {
  return (
    <div className="biblioteca-container">
      <div className="cargando">
        <div className="spinner"></div>
        <h2>🎮 Cargando tu biblioteca...</h2>
      </div>
    </div>
  );
}

return (
  <div className="biblioteca-container">
    <header className="biblioteca-header">
      <h1>🎮 Mi Biblioteca de Juegos</h1>
      
      <div className="estadisticas">
        <div className="stat-card">
          <span className="stat-numero">{totalJuegos}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card completados">
          <span className="stat-numero">{juegosCompletados}</span>
          <span className="stat-label">Completados</span>
        </div>
        <div className="stat-card pendientes">
          <span className="stat-numero">{juegosPendientes}</span>
          <span className="stat-label">Pendientes</span>
        </div>
      </div>

      <button onClick={handleAgregarJuego} className="btn-agregar">
        ➕ Agregar Juego
      </button>
    </header>

    {/* BARRA DE BÚSQUEDA - NUEVA */}
    <div className="busqueda-container">
      <div className="busqueda-input-wrapper">
        <span className="busqueda-icono">🔍</span>
        <input
          type="text"
          className="busqueda-input"
          placeholder="Buscar por título, género, plataforma o desarrollador..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {busqueda && (
          <button 
            className="busqueda-limpiar"
            onClick={() => setBusqueda('')}
          >
            ✕
          </button>
        )}
      </div>
    </div>

    <div className="filtros">
      <button 
        className={filtro === 'todos' ? 'filtro-activo' : ''}
        onClick={() => setFiltro('todos')}
      >
        Todos ({totalJuegos})
      </button>
      <button 
        className={filtro === 'completados' ? 'filtro-activo' : ''}
        onClick={() => setFiltro('completados')}
      >
        Completados ({juegosCompletados})
      </button>
      <button 
        className={filtro === 'pendientes' ? 'filtro-activo' : ''}
        onClick={() => setFiltro('pendientes')}
      >
        Pendientes ({juegosPendientes})
      </button>
    </div>

    {juegosFinales.length === 0 ? (
      <div className="sin-juegos">
        {busqueda ? (
          <>
            <h2>🔍 No se encontraron resultados</h2>
            <p>No hay juegos que coincidan con "{busqueda}"</p>
            <button onClick={() => setBusqueda('')} className="btn-limpiar-busqueda">
              Limpiar búsqueda
            </button>
          </>
        ) : (
          <>
            <h2>😔 No hay juegos en esta categoría</h2>
            <p>Agrega tu primer juego para comenzar tu biblioteca</p>
          </>
        )}
      </div>
    ) : (
      <div className="juegos-grid">
        {juegosFinales.map(juego => (  // map para recorrer cada juego y poderlo mostrar
          <TarjetaJuego
            key={juego._id}
            juego={juego}
            onEliminar={handleEliminarJuego}
            onEditar={handleEditarJuego}
            onVerDetalles={handleVerDetalles}
          />
        ))}
      </div>
    )}

      {mostrarFormulario && (
        <FormularioJuego
          juegoEditar={juegoEditar}
          onSubmit={handleSubmitFormulario}
          onCancelar={() => {
            setMostrarFormulario(false);
            setJuegoEditar(null);
          }}
        />
      )}
      {juegoDetalle && (
        <DetalleJuego
          juegoId={juegoDetalle}
          onCerrar={() => setJuegoDetalle(null)}
      />
)}
    </div>
  );
};

export default BibliotecaJuegos;