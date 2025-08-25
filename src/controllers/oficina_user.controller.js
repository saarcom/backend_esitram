const UserOficina = require('../models/oficina_user.model');

// Asignar un usuario a una oficina
exports.asignarOficina = async (req, res) => {
  try {
    const { id_usuario, id_oficina, fecha_inicio } = req.body;

    // Cerrar la oficina actual si existe
    await UserOficina.cerrarRelacion(id_usuario);

    // Asignar nueva
    const relacion = await UserOficina.asignarOficina(id_usuario, id_oficina, fecha_inicio);
    res.json({ success: true, relacion });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener oficina actual de un usuario
exports.oficinaActual = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const oficina = await UserOficina.oficinaActual(id_usuario);
    res.json({ success: true, oficina });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener historial de oficinas de un usuario
exports.historial = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const historial = await UserOficina.historial(id_usuario);
    res.json({ success: true, historial });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.getOficinas = async (req, res) => {
  try {
    const oficinas = await UserOficina.getAllOficinas();
    res.json(oficinas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};