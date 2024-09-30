const productDAO = require('../models/products');


const createProduct = async (req, res) => {
  try {
    const product = await productDAO.create(req.body);
    res.status(201).json({ status: 'success', payload: product });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  const { limit = 10, page = 1, sort = 'asc', query = '' } = req.query;
  try {
    const result = await productDAO.findAll({ limit, page, sort, query });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productDAO.findById(req.params.pid);
    if (product) {
      res.status(200).json({ status: 'success', payload: product });
    } else {
      res.status(404).json({ status: 'error', message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const success = await productDAO.deleteProduct(req.params.pid);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ status: 'error', message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const updateStock = async (req, res) => {
  const { pid } = req.params; // Obtener el ID del producto
  const { stock } = req.body; // Obtener la nueva cantidad de stock del body

  try {
    const result = await productDAO.updateStock(pid, stock); // Llamar al DAO correspondiente
    if (result) {
      res.status(200).json({ status: 'success', message: 'Stock updated successfully', product: result });
    } else {
      res.status(404).json({ status: 'error', message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error updating product stock', details: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
  updateStock,
};
