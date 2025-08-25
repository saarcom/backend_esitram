const express = require("express");
const router = express.Router();
const tramiteController = require("../controllers/tramite_user.controller");

// Crear trámite (guardar o enviar directo)
//router.post("/", tramiteController.crearTramite);

// Enviar trámites en bloque
//router.post("/enviar", tramiteController.enviarTramites);

// Listar pendientes de un usuario
//router.get("/pendientes/:usuarioId", tramiteController.listarPendientes);



//......................empezamo 
// -------------------- Acciones principales -------------------- //

// rolo: Crear trámite (guardar o enviar directo al destino)
// 
router.post('/crear', tramiteController.crearTramite);

// Derivar trámites (en bloque o individual)
router.post('/derivar', tramiteController.derivarTramite);

// -------------------- Bandejas -------------------- //
// 1. Creados
router.get('/creados/:usuarioId',tramiteController.tramitesCreados);
// 2. Recibidos
router.get('/recibidos/:usuarioId',tramiteController.tramitesRecibidos);
// 3. Pendientes por recibir
router.get('/pendientes/:usuarioId',tramiteController.tramitesPendientes);
// 4. Derivados
router.get('/derivados/:usuarioId',tramiteController.tramitesDerivados);

// ahora ///

//  Acciones principales
router.post('/recibir', tramiteController.recibirTramite);
router.post('/revertir', tramiteController.revertirTramite);

//  Historial
router.get('/historial/:idTramite', tramiteController.historialTramite);

module.exports = router;
