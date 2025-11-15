import React from 'react';
import './TarjetaJuego.css';
const TarjetaJuego = ({ juego, onEliminar, onEditar, onVerDetalles }) => {
  return (
    <div className="tarjeta-juego">
      <div className="tarjeta-imagen">
        <img 
          src={juego.imagenPortada} 
          alt={juego.titulo}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400?text=Sin+Imagen';
          }}
        />
        {juego.completado && (
          <span className="badge-completado">✓ Completado</span> // SOLO SI EL JUEGO FUE COMPLETADO
        )}
      </div>
      
      <div className="tarjeta-contenido">
        <h3>{juego.titulo}</h3>
        <p className="genero">{juego.genero} • {juego.plataforma}</p>
        <p className="año">Año: {juego.añoLanzamiento}</p>
        <p className="desarrollador">{juego.desarrollador}</p>
        
        <div className="tarjeta-acciones">
          <button onClick={() => onVerDetalles(juego._id)} className="btn-detalles">
            Ver Detalles
          </button>
          <button onClick={() => onEditar(juego)} className="btn-editar">
            ✏️ Editar
          </button>
          <button onClick={() => onEliminar(juego._id)} className="btn-eliminar">
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarjetaJuego;