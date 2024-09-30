// middlewares/cartAuth.js

const Cart = require('../models/cart'); // Asegúrate de que la ruta sea correcta

const cartAuth = async (req, res, next) => {
  try {
    const cartId = req.params.cid; // Obtenemos el ID del carrito desde los parámetros de la URL
    const userId = req.user._id; // ID del usuario autenticado

    // Busca el carrito por ID
    const cart = await Cart.findById(cartId);
    
    // Si no se encuentra el carrito, retorna un error
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Compara el owner del carrito con el ID del usuario
    if (cart.owner && cart.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Acceso denegado: solo el due;o del carro puede interactuar con el' });
    }

    // Si es el dueño, continúa al siguiente middleware o ruta
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = cartAuth;




