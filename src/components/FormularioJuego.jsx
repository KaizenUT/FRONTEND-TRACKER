import React, { useState, useEffect } from 'react';
import './FormularioJuego.css';

const FormularioJuego = ({ juegoEditar, onSubmit, onCancelar }) => {
  // Guarda TODOS los campos del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    genero: 'Acción',
    plataforma: 'PC',
    añoLanzamiento: new Date().getFullYear(),
    desarrollador: '',
    imagenPortada: '',
    descripcion: '',
    completado: false
  });

  // Si hay un juego para editar, cargar sus datos
  useEffect(() => {
    if (juegoEditar) {
      setFormData({
        titulo: juegoEditar.titulo || '',
        genero: juegoEditar.genero || 'Acción',
        plataforma: juegoEditar.plataforma || 'PC',
        añoLanzamiento: juegoEditar.añoLanzamiento || new Date().getFullYear(),
        desarrollador: juegoEditar.desarrollador || '',
        imagenPortada: juegoEditar.imagenPortada || '',
        descripcion: juegoEditar.descripcion || '',
        completado: juegoEditar.completado || false
      });
    }
  }, [juegoEditar]);

  const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
          ...formData,  // Copia todo lo que ya estaba
          [name]: type === 'checkbox' ? checked : value  // Actualiza solo el campo que cambió
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    onSubmit(formData);
  };

  return (
    <div className="formulario-overlay">
      <div className="formulario-container">
        <h2>{juegoEditar ? '✏️ Editar Juego' : '➕ Agregar Nuevo Juego'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Ej: Elden Ring"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Género *</label>
              <select name="genero" value={formData.genero} onChange={handleChange} required>
                <option value="Acción">Acción</option>
                <option value="Aventura">Aventura</option>
                <option value="RPG">RPG</option>
                <option value="Estrategia">Estrategia</option>
                <option value="Deportes">Deportes</option>
                <option value="Simulación">Simulación</option>
                <option value="Terror">Terror</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Carreras">Carreras</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Plataforma *</label>
              <select name="plataforma" value={formData.plataforma} onChange={handleChange} required>
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
                <option value="Mobile">Mobile</option>
                <option value="Múltiple">Múltiple</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Año de Lanzamiento *</label>
              <input
                type="number"
                name="añoLanzamiento"
                value={formData.añoLanzamiento}
                onChange={handleChange}
                required
                min="1970"
                max={new Date().getFullYear() + 2}
              />
            </div>

            <div className="form-group">
              <label>Desarrollador *</label>
              <input
                type="text"
                name="desarrollador"
                value={formData.desarrollador}
                onChange={handleChange}
                required
                placeholder="Ej: FromSoftware"
              />
            </div>
          </div>

          <div className="form-group">
            <label>URL de la Portada</label>
            <input
              type="url"
              name="imagenPortada"
              value={formData.imagenPortada}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows="4"
              maxLength="1000"
              placeholder="Descripción del juego..."
            />
            <small>{formData.descripcion.length}/1000 caracteres</small>
          </div>

          <div className="form-group-checkbox">
            <label>
              <input
                type="checkbox"
                name="completado"
                checked={formData.completado}
                onChange={handleChange}
              />
              ✓ Marcar como completado
            </label>
          </div>

          <div className="form-buttons">
            <button type="button" onClick={onCancelar} className="btn-cancelar">
              Cancelar
            </button>
            <button type="submit" className="btn-guardar">
              {juegoEditar ? 'Guardar Cambios' : 'Agregar Juego'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioJuego;