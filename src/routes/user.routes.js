const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller'); // <--- aquí entra
const { isAuthenticated, hasRole } = require('../middlewares/auth.middleware');


/**
 * 
 * isAuthenticated: asegura que el usuario esté logueado.

hasRole('superadmin'): asegura que el usuario tenga rol específico.

Reutilizas lógica limpia, sin repetir código.


 */
// Ruta protegida por login


router.get('/mi-pagina', isAuthenticated, (req, res) => {
  const user = req.session.user;
  res.json({
    message: `Bienvenido a tu página Sr.:   , ${user.name}`,
    datos: user
  });
});

/*
router.get('/mi-pagina', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "No has iniciado sesión_____" });
  }

  const user = req.session.user;
  res.json({
    message: `Bienvenido a tu página____, ${user.name}`,
    datos: user
  });
});
*/

//// CRUD
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.delete('/:id', userController.deletedUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
// Login
router.post('/login', userController.accederUsuario);
 // ******************
 
router.get('/:id', isAuthenticated, userController.getUserById); ///

// Ruta protegida solo para superadmin
router.get('/admin', isAuthenticated, hasRole('superadmin'), (req, res) => {
  res.json({ message: `Hola Superadmin ${req.session.user.name}` });
});

router.get('/user', isAuthenticated, hasRole('usuario'), (req, res) => {
  res.json({ message: `Hola usuario ${req.session.user.name}` });
});

module.exports = router;
