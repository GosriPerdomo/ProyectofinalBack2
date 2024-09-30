const express = require('express');
const router = express.Router();
const passport = require('passport'); // Importar passport
const UserDTO = require('../dto/userDTO'); // Importar el DTO

// Ruta para obtener el usuario actual usando autenticación
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (!req.user) return res.status(401).send({ message: 'Unauthorized' });

  const userDTO = new UserDTO(req.user); // Crear una instancia de UserDTO
  return res.status(200).send(userDTO); // Enviar el DTO como respuesta
});

module.exports = router;



