import React, { useState, useEffect } from 'react';
import './FormularioReseña.css';


const FormularioReseña = ({ juegoId, reseñaEditar, onSubmit, onCancelar }) => {
  const [formData, setFormData] = useState({
    juegoId: juegoId,
    puntuacion: 5,
    textoReseña: '',
    horasJugadas: 0,
    dificultad: 'Normal',
    recomendaria: true
  });


  useEffect(() => {
    if (reseñaEditar) {
      setFormData({
        juegoId: reseñaEditar.juegoId._id || reseñaEditar.juegoId,
        puntuacion: reseñaEditar.puntuacion || 5,
        textoReseña: reseñaEditar.textoReseña || '',
        horasJugadas: reseñaEditar.horasJugadas || 0,
        dificultad: reseñaEditar.dificultad || 'Normal',
        recomendaria: reseñaEditar.recomendaria !== undefined ? reseñaEditar.recomendaria : true
      });
    }
  }, [reseñaEditar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="formulario-overlay">
      <div className="formulario-container">
        <h2>{reseñaEditar ? '✏️ Editar Reseña' : '⭐ Escribir Reseña'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Puntuación * (1-5 estrellas)</label>
            <div className="estrellas-selector">
              {[1, 2, 3, 4, 5].map(num => (
                <span
                  key={num}
                  className={`estrella ${formData.puntuacion >= num ? 'activa' : ''}`}
                  onClick={() => setFormData({ ...formData, puntuacion: num })}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Tu Reseña *</label>
            <textarea
              name="textoReseña"
              value={formData.textoReseña}
              onChange={handleChange}
              required
              rows="6"
              minLength="10"
              maxLength="2000"
              placeholder="Escribe tu opinión sobre el juego..."
            />
            <small>{formData.textoReseña.length}/2000 caracteres</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Horas Jugadas *</label>
              <input
                type="number"
                name="horasJugadas"
                value={formData.horasJugadas}
                onChange={handleChange}
                required
                min="0"
                placeholder="Ej: 50"
              />
            </div>

            <div className="form-group">
              <label>Dificultad *</label>
              <select name="dificultad" value={formData.dificultad} onChange={handleChange} required>
                <option value="Fácil">Fácil</option>
                <option value="Normal">Normal</option>
                <option value="Difícil">Difícil</option>
                <option value="Muy Difícil">Muy Difícil</option>
              </select>
            </div>
          </div>

          <div className="form-group-checkbox">
            <label>
              <input
                type="checkbox"
                name="recomendaria"
                checked={formData.recomendaria}
                onChange={handleChange}
              />
              👍 Recomiendo este juego
            </label>
          </div>

          <div className="form-buttons">
            <button type="button" onClick={onCancelar} className="btn-cancelar">
              Cancelar
            </button>
            <button type="submit" className="btn-guardar">
              {reseñaEditar ? 'Guardar Cambios' : 'Publicar Reseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioReseña;