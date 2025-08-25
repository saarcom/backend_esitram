
/*

// Crear trámite
exports.crearTramite = async (req, res) => {
  try {
    const idTramite = await TramiteModel.createTramite(req.body);
    console.log('trmite que se recibe: ', idTramite);

    res.status(201).json({ message: "Trámite creado correctamente", id: idTramite });
  } catch (err) {
    console.error("Error al crear trámite:", err);
    res.status(500).json({ error: err.message });
  }
};

// Enviar trámites en bloque
exports.enviarTramites = async (req, res) => {
  try {
    await TramiteModel.enviarTramites(req.body);
    res.json({ message: "Trámites enviados correctamente" });
  } catch (err) {
    console.error("Error al enviar trámites:", err);
    res.status(500).json({ error: err.message });
  }
};

// Listar trámites pendientes de un usuario
exports.listarPendientes = async (req, res) => {
  try {
    const pendientes = await TramiteModel.getPendientes(req.params.usuarioId);
    res.json(pendientes);
  } catch (err) {
    console.error("Error al listar trámites pendientes:", err);
    res.status(500).json({ error: err.message });
  }
};



//--------------------ultimo funcional--------------------------------------------------------

// 1. Creados
exports.tramitesCreados = async (req, res) => {
  try {
    const { usuarioId } = req.params; 
    console.log('essssssssssssssss/' ,usuarioId);
    const data = await TramiteModel.getTramitesCreados(usuarioId);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo trámites creados" });
  }
};

// 2. Recibidos
exports.tramitesRecibidos= async(req, res)=> {
  try {
    const { usuarioId } = req.params;
    const data = await TramiteModel.getTramitesRecibidos(usuarioId);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo trámites recibidos" });
  }
}

// 3. Pendientes
exports.tramitesPendientes=async(req, res)=> {
  try {
    const { usuarioId } = req.params;
    console.log('tramitesPendientes;;;;::::' ,usuarioId);
    const data = await TramiteModel.getTramitesPendientes(usuarioId);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo trámites pendientes" });
  }
}

// 4. Derivados
exports.tramitesDerivados= async (req, res)=> {
  try {
    const { usuarioId } = req.params;
    const data = await TramiteModel.getTramitesDerivados(usuarioId);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo trámites derivados" });
  }
}

*/
const TramiteModel = require("../models/tramite_user.model");
//const TramiteModel = require("../models/tramite_user.model");

// Crear trámite
exports.crearTramite = async (req, res) => {
  try {
    const idTramite = await TramiteModel.createTramite(req.body);
    console.log('Body recibido:', req.body);
    
    res.status(201).json({ message: "Trámite creado correctamente", id: idTramite });
  } catch (err) {
    console.error("Error al crear trámite:", err);
    res.status(500).json({ error: "Error al crear trámite" });
  }
};

// Enviar trámites en bloque
exports.derivarTramite = async (req, res) => {
  try {
    await TramiteModel.derivarTramite(req.body);
    res.json({ message: "Trámites enviados correctamente" });
  } catch (err) {
    console.error("Error al enviar trámites:", err);
    res.status(500).json({ error: "Error al enviar trámites" });
  }
};

// -------------------- Bandejas -------------------- //

// 1. Creados
exports.tramitesCreados = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const data = await TramiteModel.getTramitesCreados(usuarioId);
    res.json(data);
  } catch (err) {
    console.error("Error al obtener trámites creados:", err);
    res.status(500).json({ error: "Error al obtener trámites creados" });
  }
};

// 2. Recibidos
exports.tramitesRecibidos = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const data = await TramiteModel.getTramitesRecibidos(usuarioId);
    res.json(data);
  } catch (err) {
    console.error("Error al obtener trámites recibidos:", err);
    res.status(500).json({ error: "Error al obtener trámites recibidos" });
  }
};

// 3. Pendientes por recibir
exports.tramitesPendientes = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const data = await TramiteModel.getTramitesPendientesRecepcion(usuarioId); // 👈 importante usar la misma función del Model
    res.json(data);
  } catch (err) {
    console.error("Error al obtener trámites pendientes:", err);
    res.status(500).json({ error: "Error al obtener trámites pendientes" });
  }
};

// 4. Derivados
exports.tramitesDerivados = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const data = await TramiteModel.getTramitesDerivados(usuarioId);
    res.json(data);
  } catch (err) {
    console.error("Error al obtener trámites derivados:", err);
    res.status(500).json({ error: "Error al obtener trámites derivados" });
  }
};






//  Recibir trámite
exports.recibirTramite = async (req, res) => {
  try {
    await TramiteModel.recibirTramite(req.body);
    res.json({ message: "Trámite recibido correctamente" });
  } catch (err) {
    console.error("Error al recibir trámite:", err);
    res.status(500).json({ error: err.message });
  }
};

//  Revertir trámite
exports.revertirTramite = async (req, res) => {
  try {
    await TramiteModel.revertirTramite(req.body);
    res.json({ message: "Trámite revertido correctamente" });
  } catch (err) {
    console.error("Error al revertir trámite:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📌 Historial de un trámite
exports.historialTramite = async (req, res) => {
  try {
    const historial = await TramiteModel.getHistorialTramite(req.params.idTramite);
    res.json(historial);
  } catch (err) {
    console.error("Error al obtener historial:", err);
    res.status(500).json({ error: err.message });
  }
};