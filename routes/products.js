const express = require('express');
const router = express.Router();
const productController = require('../controller/products.controller');
const authorizationMiddleware = require('../middlewares/auth.middleware')
// Crear un nuevo producto
router.post('/', authorizationMiddleware, productController.createProduct);

// Obtener todos los productos con paginación y filtros
router.get('/',  productController.getAllProducts);

// Obtener un producto por ID
router.get('/:pid', productController.getProductById);

// Eliminar un producto por ID
router.delete('/:pid', authorizationMiddleware, productController.deleteProductById);

// Ruta para actualizar el stock de un producto
router.put('/:pid/stock', authorizationMiddleware, productController.updateStock); 

module.exports = router;






