const cartDao = require('../dao/cart.dao');
const Cart = require('../models/cart'); 
const Ticket = require('../models/ticket'); 
const Product = require('../models/products'); 
const cartDTO = require('../dto/cartDTO')
const TicketDTO = require('../dto/ticketDTO'); // Importa el DTO del ticket

// Crear un nuevo carrito
const createCart = async (req, res) => {
  try {
    const result = await cartDao.create();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error creating cart', details: error.message });
  }
};

// Agregar producto al carrito
const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const result = await cartDao.addProduct(cid, pid, quantity);
    if (result.status === 'success') {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error adding product to cart', details: error.message });
  }
};

// Obtener todos los carritos
const getAllCarts = async (req, res) => {
  try {
    const result = await cartDao.findAll();
    res.status(200).json({ status: 'success', payload: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error retrieving carts', details: error.message });
  }
};

// Obtener un carrito por ID
const getCartById = async (req, res) => {
  const { cid } = req.params;

  try {
    const result = await cartDao.findById(cid);
    if (result) {
      res.status(200).json({ status: 'success', payload: result });
    } else {
      res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error retrieving cart', details: error.message });
  }
};

// Actualizar la cantidad de un producto en el carrito
const updateProductQuantityInCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const result = await cartDao.updateProductQuantity(cid, pid, quantity);
    if (result.status === 'success') {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error updating product quantity', details: error.message });
  }
};

// Eliminar un producto del carrito
const removeProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const result = await cartDao.removeProduct(cid, pid);
    if (result) {
      res.status(200).json({ status: 'success', message: 'Product removed from cart' });
    } else {
      res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error removing product from cart', details: error.message });
  }
};

// Eliminar todos los productos del carrito
const clearCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const result = await cartDao.clear(cid);
    if (result) {
      res.status(200).json({ status: 'success', message: 'Cart cleared' });
    } else {
      res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error clearing cart', details: error.message });
  }
};

const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;

    // Obtener el carrito por ID y popular los productos
    const cart = await Cart.findById(cid).populate('products.product');
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Inicializar total y arrays para productos no disponibles y comprados
    let total = 0;
    const unavailableProducts = [];
    const purchasedProducts = [];

    for (let item of cart.products) {
      const product = item.product;

      // Verificar si hay suficiente stock
      if (product.stock < item.quantity) {
        unavailableProducts.push(product.name); // Agregar a productos no disponibles
      } else {
        // Restar el stock del producto
        product.stock -= item.quantity;
        await product.save();

        // Calcular el total
        total += product.price * item.quantity;

        // Agregar a productos comprados
        purchasedProducts.push({
          productId: product._id,
          quantity: item.quantity,
        });
      }
    }

    // Si no se compró ningún producto, retornar un mensaje de error
    if (purchasedProducts.length === 0) {
      return res.status(400).json({
        message: 'No se pudo realizar la compra, ninguno de sus productos está disponible',
        unavailableProducts,
      });
    }

    // Solo eliminar los productos que fueron comprados exitosamente
    cart.products = cart.products.filter(item => {
      const product = item.product;
      return purchasedProducts.some(p => p.productId.toString() !== product._id.toString());
    });

    await cart.save(); // Guardar los cambios en el carrito

    // Crear el ticket en la base de datos
    const ticketData = {
      code: generateUniqueCode(), // Asegúrate de tener esta función para generar un código único
      purchase_datetime: new Date(),
      amount: total,
      purchaser: req.user.email, // Asegúrate de que req.user tenga el email
    };

    const ticket = await Ticket.create(ticketData); // Crea el ticket en la base de datos

    // Crear el DTO del ticket
    const ticketDTO = new TicketDTO(ticket);

    // Retornar éxito en la compra
    res.status(200).json({
      message: 'Compra realizada con éxito',
      total,
      unavailableProducts,
      ticket: ticketDTO, // Incluir el ticket DTO en la respuesta
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al procesar la compra', details: error.message });
  }
};

const generateUniqueCode = () => {
  // Lógica para generar un código único para el ticket
  return 'TICKET-' + Math.random().toString(36).substring(2, 15).toUpperCase();
};





module.exports = {
  createCart,
  addProductToCart,
  getAllCarts,
  getCartById,
  updateProductQuantityInCart,
  removeProductFromCart,
  clearCart,
  purchaseCart
};


