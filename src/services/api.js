import axios from 'axios';  //peticiones pa el backend más easy

// URL base de backend
const API_URL = 'https://backend-tracker-d5x9.onrender.com/';

// ==================== SERVICIOS DE JUEGOS ====================

// Obtener todos los juegos
export const obtenerJuegos = async () => {
  try {
    const response = await axios.get(`${API_URL}/game`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener juegos:', error);
    throw error;
  }
};

// Obtener un juego por ID
export const obtenerJuegoPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/game/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener juego:', error);
    throw error;
  }
};

// Crear un nuevo juego
export const crearJuego = async (juegoData) => {
  try {
    const response = await axios.post(`${API_URL}/game`, juegoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear juego:', error);
    throw error;
  }
};

// Actualizar un juego
export const actualizarJuego = async (id, juegoData) => {
  try {
    const response = await axios.put(`${API_URL}/game/${id}`, juegoData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar juego:', error);
    throw error;
  }
};

// Eliminar un juego
export const eliminarJuego = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/game/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar juego:', error);
    throw error;
  }
};

// ==================== SERVICIOS DE RESEÑAS ====================

// Obtener todas las reseñas
export const obtenerReseñas = async () => {
  try {
    const response = await axios.get(`${API_URL}/review`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    throw error;
  }
};

// Obtener reseñas de un juego específico
export const obtenerReseñasPorJuego = async (juegoId) => {
  try {
    const response = await axios.get(`${API_URL}/review/juego/${juegoId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener reseñas del juego:', error);
    throw error;
  }
};

// Crear una nueva reseña
export const crearReseña = async (reseñaData) => {
  try {
    const response = await axios.post(`${API_URL}/review`, reseñaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear reseña:', error);
    throw error;
  }
};

// Actualizar una reseña
export const actualizarReseña = async (id, reseñaData) => {
  try {
    const response = await axios.put(`${API_URL}/review/${id}`, reseñaData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar reseña:', error);
    throw error;
  }
};

// Eliminar una reseña
export const eliminarReseña = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/review/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    throw error;
  }
};