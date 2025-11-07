import React, { useState, useEffect } from 'react';
import { obtenerJuegos, obtenerReseñas } from '../services/api';
import './EstadisticasPersonales.css';

const EstadisticasPersonales = () => {
  const [juegos, setJuegos] = useState([]);
  const [reseñas, setReseñas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const responseJuegos = await obtenerJuegos();
      const responseReseñas = await obtenerReseñas();
      
      setJuegos(responseJuegos.data);
      setReseñas(responseReseñas.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setCargando(false);
    }
  };

  // Calcular estadísticas
  const totalJuegos = juegos.length;
  const juegosCompletados = juegos.filter(j => j.completado).length;
  const juegosPendientes = totalJuegos - juegosCompletados;
  const porcentajeCompletado = totalJuegos > 0 ? ((juegosCompletados / totalJuegos) * 100).toFixed(1) : 0;

  // Total de horas jugadas
  const totalHorasJugadas = reseñas.reduce((sum, r) => sum + (r.horasJugadas || 0), 0);

  // Promedio de puntuación
  const promedioPuntuacion = reseñas.length > 0
    ? (reseñas.reduce((sum, r) => sum + r.puntuacion, 0) / reseñas.length).toFixed(1)
    : 0;

  // Juego más jugado
  const juegoMasJugado = reseñas.length > 0
    ? reseñas.reduce((max, r) => r.horasJugadas > (max.horasJugadas || 0) ? r : max, reseñas[0])
    : null;

  // Géneros más jugados
  const generosCont = {};
  juegos.forEach(j => {
    generosCont[j.genero] = (generosCont[j.genero] || 0) + 1;
  });
  const generosOrdenados = Object.entries(generosCont)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Plataformas más usadas
  const plataformasCont = {};
  juegos.forEach(j => {
    plataformasCont[j.plataforma] = (plataformasCont[j.plataforma] || 0) + 1;
  });
  const plataformasOrdenadas = Object.entries(plataformasCont)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Dificultad promedio
  const dificultades = { 'Fácil': 1, 'Normal': 2, 'Difícil': 3, 'Muy Difícil': 4 };
  const dificultadPromedio = reseñas.length > 0
    ? reseñas.reduce((sum, r) => sum + (dificultades[r.dificultad] || 0), 0) / reseñas.length
    : 0;
  const dificultadTexto = dificultadPromedio <= 1.5 ? 'Fácil' : 
                          dificultadPromedio <= 2.5 ? 'Normal' : 
                          dificultadPromedio <= 3.5 ? 'Difícil' : 'Muy Difícil';

if (cargando) {
  return (
    <div className="estadisticas-container">
      <div className="cargando">
        <div className="spinner"></div>
        <h2>📊 Cargando estadísticas...</h2>
      </div>
    </div>
  );
}

  if (totalJuegos === 0) {
    return (
      <div className="estadisticas-container">
        <div className="sin-datos">
          <h2>📊 Estadísticas Personales</h2>
          <p>No hay datos suficientes. Agrega juegos para ver tus estadísticas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="estadisticas-container">
      <header className="estadisticas-header">
        <h1>📊 Mis Estadísticas de Gaming</h1>
        <p className="subtitulo">Resumen completo de tu actividad como gamer</p>
      </header>

      {/* Tarjetas principales */}
      <div className="stats-principales">
        <div className="stat-box azul">
          <div className="stat-icono">🎮</div>
          <div className="stat-valor">{totalJuegos}</div>
          <div className="stat-titulo">Total de Juegos</div>
        </div>

        <div className="stat-box verde">
          <div className="stat-icono">✅</div>
          <div className="stat-valor">{juegosCompletados}</div>
          <div className="stat-titulo">Completados</div>
          <div className="stat-extra">{porcentajeCompletado}% de tu biblioteca</div>
        </div>

        <div className="stat-box naranja">
          <div className="stat-icono">⏱️</div>
          <div className="stat-valor">{totalHorasJugadas}h</div>
          <div className="stat-titulo">Horas Jugadas</div>
          <div className="stat-extra">{(totalHorasJugadas / 24).toFixed(1)} días</div>
        </div>

        <div className="stat-box amarillo">
          <div className="stat-icono">⭐</div>
          <div className="stat-valor">{promedioPuntuacion}</div>
          <div className="stat-titulo">Puntuación Media</div>
          <div className="stat-extra">De {reseñas.length} reseñas</div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="progreso-section">
        <h3>📈 Progreso de Completitud</h3>
        <div className="barra-progreso">
          <div 
            className="barra-fill" 
            style={{ width: `${porcentajeCompletado}%` }}
          >
            <span className="barra-texto">{porcentajeCompletado}%</span>
          </div>
        </div>
        <div className="progreso-labels">
          <span>{juegosCompletados} Completados</span>
          <span>{juegosPendientes} Pendientes</span>
        </div>
      </div>

      <div className="stats-grid">
        {/* Géneros más jugados */}
        <div className="stat-card">
          <h3>🎯 Géneros Favoritos</h3>
          <div className="lista-barras">
            {generosOrdenados.map(([genero, cantidad]) => (
              <div key={genero} className="barra-item">
                <div className="barra-label">
                  <span>{genero}</span>
                  <span className="barra-valor">{cantidad}</span>
                </div>
                <div className="barra-horizontal">
                  <div 
                    className="barra-horizontal-fill genero" 
                    style={{ width: `${(cantidad / totalJuegos) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plataformas más usadas */}
        <div className="stat-card">
          <h3>🎮 Plataformas Más Usadas</h3>
          <div className="lista-barras">
            {plataformasOrdenadas.map(([plataforma, cantidad]) => (
              <div key={plataforma} className="barra-item">
                <div className="barra-label">
                  <span>{plataforma}</span>
                  <span className="barra-valor">{cantidad}</span>
                </div>
                <div className="barra-horizontal">
                  <div 
                    className="barra-horizontal-fill plataforma" 
                    style={{ width: `${(cantidad / totalJuegos) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Juego más jugado */}
        {juegoMasJugado && (
          <div className="stat-card destacado">
            <h3>🏆 Juego Más Jugado</h3>
            <div className="juego-destacado">
              <img 
                src={juegoMasJugado.juegoId?.imagenPortada || 'https://via.placeholder.com/150'} 
                alt={juegoMasJugado.juegoId?.titulo || 'Juego'}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150x200?text=Sin+Imagen';
                }}
              />
              <div className="juego-info">
                <h4>{juegoMasJugado.juegoId?.titulo || 'Juego'}</h4>
                <p className="horas-destacado">⏱️ {juegoMasJugado.horasJugadas} horas</p>
                <p className="estrellas-destacado">
                  {'⭐'.repeat(juegoMasJugado.puntuacion)} ({juegoMasJugado.puntuacion}/5)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dificultad promedio */}
        <div className="stat-card">
          <h3>🎯 Nivel de Dificultad</h3>
          <div className="dificultad-display">
            <div className="dificultad-icono">
              {dificultadPromedio <= 2 ? '😊' : dificultadPromedio <= 3 ? '😐' : '😰'}
            </div>
            <div className="dificultad-texto">{dificultadTexto}</div>
            <p className="dificultad-desc">Dificultad promedio de tus juegos</p>
          </div>
        </div>
      </div>

      {/* Insights adicionales */}
      <div className="insights-section">
        <h3>💡 Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <span className="insight-icono">📚</span>
            <p>Tienes <strong>{totalJuegos}</strong> juegos en tu biblioteca</p>
          </div>
          <div className="insight-card">
            <span className="insight-icono">📝</span>
            <p>Has escrito <strong>{reseñas.length}</strong> reseñas</p>
          </div>
          <div className="insight-card">
            <span className="insight-icono">🎉</span>
            <p>Has completado el <strong>{porcentajeCompletado}%</strong> de tus juegos</p>
          </div>
          {totalHorasJugadas > 100 && (
            <div className="insight-card destacado">
              <span className="insight-icono">🔥</span>
              <p>¡Wow! Más de <strong>100 horas</strong> jugadas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasPersonales;