const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/UsuarioController');
const authenticate = require('../middlewares/auth.middleware');

// Middleware para proteger rutas
const authenticateAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

// Rutas CRUD
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.post('/register', usuarioController.registrarUsuario);
router.post('/login', usuarioController.loginUsuario);
router.get('/current', authenticate, usuarioController.obtenerUsuarioPorId); 
router.put('/:id', authenticate, authenticateAdmin, usuarioController.actualizarUsuario); 
router.delete('/:id', authenticate, authenticateAdmin, usuarioController.eliminarUsuario); 

module.exports = router;





