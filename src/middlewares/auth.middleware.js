/*exports.requireRole = (roles) => {
  return (req, res, next) => {
    const user = req.user; // Este debe estar cargado desde el login/session
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };
};
*/

// Verifica si el usuario está logueado
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).json({ message: "No has iniciado sesión" });
  }
}

// Verifica si el usuario tiene el rol requerido
function hasRole(role) {
  return (req, res, next) => {
    const user = req.session.user;

    if (!user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: `Acceso denegado. Se requiere rol: ${role}` });
    }

    next(); // todo bien
  };
}

module.exports = {
  isAuthenticated,
  hasRole
};
