const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller'); // <--- aquí entra
const oficina_userController = require('../controllers/oficina_user.controller');
const { isAuthenticated, hasRole } = require('../middlewares/auth.middleware');

router.get('/mi-pagina', isAuthenticated, (req, res) => {
  const user = req.session.user;
  res.json({
    message: `Bienvenido a tu página Sr.:   , ${user.name}`,
    datos: user
  });
});


/*
para ver todo los permisosr  define las rutas más específicas antes 
que las dinámicas (:param), para evitar que se traguen rutas que no deberían.*/
router.get('/permisos',userController.getPermiso);
//rolo: Ruta para eliminar el usuario y su permiso 
router.delete('/:id', userController.eliminarUsuario);

//rolo: actualizar los permisos de un usuario: quitar los anteriores y asignar los nuevos.
router.put('/actualizar-permisos', userController.actualizarPermisos);


//rolo: para mostrar todo los usuarios incluyendo sus permisos
router.get('/', userController.getUsers);
router.post('/', userController.createUser);  
   //router.delete('/:id', userController.deletedUser); // ya no utiliza smo por que solo eelimina el usuario 
router.get('/:id', userController.getUserById);
//rolo: Actuliza los datos del usuario y los permisos
router.put('/:id', userController.updateUser);
//rolo: Login sirve para logearse
router.post('/login', userController.accederUsuario);
//rolo: para crear usuarios con permiso ,, solo el admin puede crear
  router.post('/crear', userController.crearUsuario);


  


module.exports = router;
