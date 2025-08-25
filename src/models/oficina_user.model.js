
const pool = require('../db');

// Crear relación usuario-oficina
async function asignarOficina(id_usuario, id_oficina, fecha_inicio) {
  try {

      console.log("...........:>>>>>>>>>>>>>", id_usuario, id_oficina,)
    const query = `
      INSERT INTO user_oficina (id_usuario, id_oficina, fecha_inicio, actual)
      VALUES ($1, $2, $3, TRUE)
      RETURNING *;
    `;
    const values = [id_usuario, id_oficina, fecha_inicio || new Date()];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw new Error("Error al asignar oficina: " + error.message);
  }
}

// Cerrar relación (cuando cambia de oficina)
async function cerrarRelacion(id_usuario) {
  try {
    const query = `
      UPDATE user_oficina
      SET actual = FALSE, fecha_fin = NOW()
      WHERE id_usuario = $1 AND actual = TRUE
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_usuario]);
    return rows[0];
  } catch (error) {
    throw new Error("Error al cerrar relación oficina: " + error.message);
  }
}

// Consultar oficina actual del usuario
async function oficinaActual(id_usuario) {
  try {
    const query = `
      SELECT uo.*, o.nombre AS oficina
      FROM user_oficina uo
      JOIN oficinas o ON o.id = uo.id_oficina
      WHERE uo.id_usuario = $1 AND uo.actual = TRUE;
    `;
    const { rows } = await pool.query(query, [id_usuario]);
    return rows[0];
  } catch (error) {
    throw new Error("Error al obtener oficina actual: " + error.message);
  }
}

// Historial completo de oficinas
async function historial(id_usuario) {
  try {
    const query = `
      SELECT uo.*, o.nombre AS oficina
      FROM user_oficina uo
      JOIN oficinas o ON o.id = uo.id_oficina
      WHERE uo.id_usuario = $1
      ORDER BY uo.fecha_inicio DESC;
    `;
    const { rows } = await pool.query(query, [id_usuario]);
    return rows;
  } catch (error) {
    throw new Error("Error al obtener historial de oficinas: " + error.message);
  }
}


async function getAllOficinas() {
  const { rows } = await pool.query('SELECT * FROM oficinas ;');
  return rows;
}
module.exports = {
  asignarOficina,
  cerrarRelacion,
  oficinaActual,
  historial,
  getAllOficinas
};
