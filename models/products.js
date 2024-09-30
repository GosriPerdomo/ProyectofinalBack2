const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

const create = async (productData) => {
  return await Product.create(productData);
};

const findAll = async ({ limit, page, sort, query }) => {
  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: { price: sort === 'asc' ? 1 : -1 },
  };
  const filter = query ? { name: { $regex: query, $options: 'i' } } : {};
  return await Product.paginate(filter, options);
};

const findById = async (productId) => {
  return await Product.findById(productId);
};

const deleteProduct = async (productId) => {
  const result = await Product.findByIdAndDelete(productId);
  return result !== null;
};

module.exports = {
  create,
  findAll,
  findById,
  deleteProduct,
};


