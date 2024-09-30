const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Product = require('../models/products');

const create = async () => {
  const cart = new Cart();
  return await cart.save();
};

const addProduct = async (cid, pid, quantity) => {
  try {
    // Asegúrate de que los IDs sean del tipo ObjectId
    const cartId = mongoose.Types.ObjectId(cid);
    const productId = mongoose.Types.ObjectId(pid);
    
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return { status: 'error', message: 'Cart not found' };
    }

    const product = await Product.findById(productId);
    if (!product) {
      return { status: 'error', message: 'Product not found' };
    }

    // Buscar si el producto ya existe en el carrito
    const productIndex = cart.products.findIndex(p => p.product.toString() === productId.toString());

    if (productIndex > -1) {
      // Si el producto ya está en el carrito, suma la cantidad
      cart.products[productIndex].quantity += quantity;
    } else {
      // Si el producto no está en el carrito, agrégalo con el ID correcto
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return { status: 'success', message: 'Product added to cart successfully' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};

const findAll = async () => {
  return await Cart.find();
};

const findById = async (id) => {
  const cart = await Cart.findById(id).populate('products.product');
  if (!cart) return null;

  // Omite el campo `stock` y muestra el campo `quantity`
  cart.products = cart.products.map(p => ({
    product: {
      _id: p.product._id,
      name: p.product.name,
      description: p.product.description,
      price: p.product.price,
      category: p.product.category,
    },
    quantity: p.quantity
  }));

  return cart;
};

const updateProductQuantity = async (cid, pid, quantity) => {
  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      return { status: 'error', message: 'Cart not found' };
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex > -1) {
      // Actualizar la cantidad del producto en el carrito
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return { status: 'success', message: 'Product quantity updated successfully' };
    } else {
      return { status: 'error', message: 'Product not found in cart' };
    }
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};

const removeProduct = async (cid, pid) => {
  const cart = await Cart.findById(cid);
  if (!cart) return null;

  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  return await cart.save();
};

const clear = async (cid) => {
  const cart = await Cart.findById(cid);
  if (!cart) return null;

  cart.products = [];
  return await cart.save();
};

module.exports = {
  create,
  addProduct,
  findAll,
  findById,
  updateProductQuantity,
  removeProduct,
  clear
};











