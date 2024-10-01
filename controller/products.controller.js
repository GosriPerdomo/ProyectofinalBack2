const productDAO = require('../models/products');
const Product = require('../models/products'); 


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

const updateProductQuantity = async (req, res) => {
  const { pid } = req.params;
  const { quantity } = req.body; // Obtener la nueva cantidad desde el cuerpo de la solicitud

  try {
    // Validar la cantidad
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: 'La cantidad debe ser un número positivo' });
    }

    // Buscar el producto por ID
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Actualizar el stock del producto
    product.stock = quantity; // Asignar la nueva cantidad al stock
    await product.save(); // Guardar los cambios en la base de datos

    // Retornar la respuesta
    res.status(200).json({ message: 'Cantidad de producto actualizada con éxito', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la cantidad del producto' });
  }
};



module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
  updateProductQuantity
};
