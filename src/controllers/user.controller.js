const UserModel = require('../models/user.model');

exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await UserModel.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletedUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await UserModel.deleteById(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado', user: deletedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;  // obtienes el id de la URL
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body; // Aquí vienen los datos nuevos (name, email, etc)

  try {
    const updatedUser = await UserModel.updateById(id, data);
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.accederUsuario = async (req, res) => {
  try {
    const { email, password } = req.body; // ← Usar req.body para POST
    // Verifica campos vacíos
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    }

    // Busca el usuario en la base de datos
    //const user = await UserModel.loginUser(email, password);
    // Busca el usuario y permisos en la base de datos
    const loginResult = await UserModel.loginUser(email, password);

    if (!loginResult || !loginResult.user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Extrae usuario y permisos del resultado
    const { user, permisos } = loginResult;

    // Guarda la información relevante en la sesión
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      role_id: user.role_id,
      permisos: permisos // ← Añadimos los permisos a la sesión
    };

    console.log("Login exitoso para:", user.email);

return res.json({ 
      message: "Login exitoso", 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        role_id: user.role_id
      },
      permisos: permisos 
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**   nuevo para logearse */

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.getUserById(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    console.error('Error al obtener usuario por ID:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



// En user.controller.js
/*
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  // En producción usarías JWT, aquí solo una respuesta simple
  res.json({ message: 'Login correcto', user });
};*/
