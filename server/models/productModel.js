// models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: String,
  pdetails: String,
  status: String,
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;
