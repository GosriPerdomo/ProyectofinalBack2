const passport = require('passport');

const authorizationMiddleware = (req, res, next) => {
  // Verificar la autenticación usando passport
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Error de autenticación' });
    }

    if (!user) {
      return res.status(401).json({ message: 'No estás autorizado' });
    }

    req.user = user; // Asignar el usuario autenticado a req.user
    console.log('Usuario autenticado:', req.user); // Registro para depuración

    const userRole = req.user.role;
    
    // Permitir a los usuarios agregar productos a su carrito
    if (req.method === 'POST' && req.path.startsWith('/carts/')) {
      if (userRole !== 'user') {
        return res.status(403).json({ message: 'Acceso denegado: solo usuarios pueden agregar productos a su carrito' });
      }
    }


    // Verificar permisos para la gestión de productos
    if (['POST', 'PUT', 'DELETE'].includes(req.method) && req.path.startsWith('/products')) {
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado: solo administradores pueden gestionar productos' });
      }
    }


    // Si el usuario tiene acceso, permite continuar
    next();
  })(req, res, next); // Llamar a la función de autenticación con los parámetros req, res, next
};

module.exports = authorizationMiddleware;









