const express = require('express');
const router = express.Router();
const oficina_userController = require('../controllers/oficina_user.controller');

// Asignar usuario a una oficina
router.post('/asignar', oficina_userController.asignarOficina);

// Consultar oficina actual
router.get('/actual/:id_usuario', oficina_userController.oficinaActual);

// Historial de oficinas
router.get('/historial/:id_usuario', oficina_userController.historial);

//

router.get('/', oficina_userController.getOficinas);

module.exports = router;
