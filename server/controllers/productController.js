// controllers/productController.js
const productModel = require("../models/productModel");


const createProduct = async (req, res) => {
  const { name,price, pdetails, status } = req.body;

  try {
    const Product = await productModel.create({
      name,
      price,
      pdetails,
      status,
    });
    res.status(201).send("SAVED");
  } catch (err) {
    console.error("Error creating Product:", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the Product." });
  }
};



const getAllProduct = async (req, res) => {
    try {
      // Sort by createdDate in descending order (-1)
      const Product = await productModel.find().sort({ createdDate: -1 });
      res.json(Product);
    } catch (err) {
      console.error("Error retrieving Product:", err);
      res.status(500).json({ error: "An error occurred while retrieving the Product." });
    }
  };
  

const getProductById = async (req, res) => {
  const { ProductId } = req.params;
  try {
    const Product = await productModel.findById(ProductId);
    if (!Product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(Product);
  } catch (err) {
    console.error("Error retrieving Product:", err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the Product." });
  }
};


const updateProductById = async (req, res) => {
    const { PId } = req.params;
    const { name, price, pdetails, status } = req.body;
  
    try {
      // Proceed to update the Product
      const Product = await productModel.findByIdAndUpdate(
        PId,
        { name, price, pdetails, status },
        { new: true }
      );
  
      if (!Product) {
        return res.status(404).json({ error: "Product not found." });
      }
  
      res.status(200).send("UPDATED");
    } catch (err) {
      console.error("Error updating Product:", err);
      res.status(500).json({ error: "An error occurred while updating the Product." });
    }
  };
  

const deleteProductById = async (req, res) => {
  const { PId } = req.params;
  try {
    const Product = await productModel.findByIdAndDelete(PId);
    if (!Product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).send("DELETED")
  } catch (err) {
    console.error("Error deleting Product:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the Product." });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
