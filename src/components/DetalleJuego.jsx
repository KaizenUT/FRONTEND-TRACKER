import React, { useState, useEffect, useCallback } from 'react';
import { obtenerJuegoPorId, obtenerReseñasPorJuego, eliminarReseña, crearReseña, actualizarReseña } from '../services/api';
import FormularioReseña from './FormularioReseña';
import './DetalleJuego.css';

const DetalleJuego = ({ juegoId, onCerrar }) => {
  const [juego, setJuego] = useState(null);
  const [reseñas, setReseñas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormReseña, setMostrarFormReseña] = useState(false);
  const [reseñaEditar, setReseñaEditar] = useState(null);
  const [busquedaReseña, setBusquedaReseña] = useState(''); // ← NUEVO ESTADO

  // FUNCIÓN cargarDatos PRIMERO
  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      const responseJuego = await obtenerJuegoPorId(juegoId);
      const responseReseñas = await obtenerReseñasPorJuego(juegoId);
      
      setJuego(responseJuego.data);
      setReseñas(responseReseñas.data);
    } catch (error) {
      console.error('Error al cargar detalles:', error);
    } finally {
      setCargando(false);
    }
  }, [juegoId]);

  // AHORA SÍ el useEffect
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleAgregarReseña = () => {
    setReseñaEditar(null);
    setMostrarFormReseña(true);
  };

  const handleEditarReseña = (reseña) => {
    setReseñaEditar(reseña);
    setMostrarFormReseña(true);
  };

  const handleSubmitReseña = async (formData) => {
    try {
      if (reseñaEditar) {
        await actualizarReseña(reseñaEditar._id, formData);
        alert('✅ Reseña actualizada exitosamente');
      } else {
        await crearReseña(formData);
        alert('✅ Reseña publicada exitosamente');
      }
      
      setMostrarFormReseña(false);
      setReseñaEditar(null);
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al guardar la reseña');
    }
  };

  const handleEliminarReseña = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reseña?')) {
      try {
        await eliminarReseña(id);
        alert('✅ Reseña eliminada exitosamente');
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('❌ Error al eliminar la reseña');
      }
    }
  };

  // Calcular promedio de puntuación
  const promedioEstrellas = reseñas.length > 0
    ? (reseñas.reduce((sum, r) => sum + r.puntuacion, 0) / reseñas.length).toFixed(1)
    : 0;

  // ← NUEVO: Filtrar reseñas por búsqueda
  const reseñasFiltradas = reseñas.filter(reseña => {
    if (!busquedaReseña) return true;
    
    const searchLower = busquedaReseña.toLowerCase();
    return (
      reseña.textoReseña.toLowerCase().includes(searchLower) ||
      reseña.dificultad.toLowerCase().includes(searchLower)
    );
  });

  if (cargando) {
    return (
      <div className="detalle-overlay">
        <div className="detalle-container">
          <div style={{ padding: '100px', textAlign: 'center' }}>
            <h2>🎮 Cargando...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!juego) return null;

  return (
    <div className="detalle-overlay" onClick={onCerrar}>
      <div className="detalle-container" onClick={(e) => e.stopPropagation()}>
        <button className="btn-cerrar" onClick={onCerrar}>✕</button>
        
        <div className="detalle-contenido">
          <div className="detalle-imagen">
            <img 
              src={juego.imagenPortada} 
              alt={juego.titulo}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x600?text=Sin+Imagen';
              }}
            />
            {juego.completado && (
              <span className="badge-completado-grande">✓ Completado</span>
            )}
          </div>

          <div className="detalle-info">
            <h1>{juego.titulo}</h1>
            
            {reseñas.length > 0 && (
              <div className="promedio-estrellas">
                <span className="estrellas-grandes">
                  {'⭐'.repeat(Math.round(promedioEstrellas))}
                </span>
                <span className="puntuacion-numero">{promedioEstrellas}/5</span>
                <span className="total-reseñas">({reseñas.length} {reseñas.length === 1 ? 'reseña' : 'reseñas'})</span>
              </div>
            )}
            
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Género:</span>
                <span className="info-valor">{juego.genero}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Plataforma:</span>
                <span className="info-valor">{juego.plataforma}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Año:</span>
                <span className="info-valor">{juego.añoLanzamiento}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Desarrollador:</span>
                <span className="info-valor">{juego.desarrollador}</span>
              </div>
            </div>

            <div className="descripcion">
              <h3>📖 Descripción</h3>
              <p>{juego.descripcion}</p>
            </div>

            <div className="reseñas-seccion">
              <div className="reseñas-header">
                <h3>💬 Reseñas ({reseñas.length})</h3>
                <button onClick={handleAgregarReseña} className="btn-agregar-reseña">
                  ⭐ Escribir Reseña
                </button>
              </div>

              {/* ← NUEVO: Búsqueda de reseñas */}
              {reseñas.length > 0 && (
                <div className="busqueda-reseñas">
                  <input
                    type="text"
                    className="busqueda-reseñas-input"
                    placeholder="🔍 Buscar en reseñas..."
                    value={busquedaReseña}
                    onChange={(e) => setBusquedaReseña(e.target.value)}
                  />
                  {busquedaReseña && (
                    <button 
                      className="btn-limpiar-busqueda-reseña"
                      onClick={() => setBusquedaReseña('')}
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
              
              {/* ← ACTUALIZADO: Usar reseñasFiltradas en lugar de reseñas */}
              {reseñasFiltradas.length === 0 && reseñas.length > 0 ? (
                <p className="sin-reseñas">
                  🔍 No se encontraron reseñas que coincidan con "{busquedaReseña}"
                </p>
              ) : reseñas.length === 0 ? (
                <p className="sin-reseñas">
                  No hay reseñas para este juego aún. ¡Sé el primero en escribir una!
                </p>
              ) : (
                <div className="reseñas-lista">
                  {reseñasFiltradas.map(reseña => (
                    <div key={reseña._id} className="reseña-card">
                      <div className="reseña-header">
                        <div className="estrellas">
                          {'⭐'.repeat(reseña.puntuacion)}
                          <span className="puntuacion-texto">({reseña.puntuacion}/5)</span>
                        </div>
                        <span className="reseña-fecha">
                          {new Date(reseña.fechaCreacion).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <p className="reseña-texto">{reseña.textoReseña}</p>
                      
                      <div className="reseña-detalles">
                        <span>⏱️ {reseña.horasJugadas}h jugadas</span>
                        <span>🎯 {reseña.dificultad}</span>
                        <span>{reseña.recomendaria ? '👍 Recomendado' : '👎 No recomendado'}</span>
                      </div>

                      <div className="reseña-acciones">
                        <button 
                          onClick={() => handleEditarReseña(reseña)} 
                          className="btn-editar-reseña"
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          onClick={() => handleEliminarReseña(reseña._id)} 
                          className="btn-eliminar-reseña"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {mostrarFormReseña && (
          <FormularioReseña
            juegoId={juegoId}
            reseñaEditar={reseñaEditar}
            onSubmit={handleSubmitReseña}
            onCancelar={() => {
              setMostrarFormReseña(false);
              setReseñaEditar(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DetalleJuego;