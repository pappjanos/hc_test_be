const Product = require("../models/Product");

const addProduct = async (req, res) => {
  try {
    const userId = res.locals.user.id
    const userRole = res.locals.user.role
    if (userRole !== 'seller') {
      return res.status(401).json({
        message: "User does not have the right privilige",
        msg_id: "PRODUCT_ROLE_MISSING",
      });
    }
    const { amountAvailable, productName, cost } = req.body;

    if (!amountAvailable || !productName || !cost)
      return res.status(400).json({
        message: "Product properties missing",
        msg_id: "PRODUCT_PROPERTIES_MISSING",
      });
    const product = await Product.create({
      amountAvailable,
      productName,
      sellerId: userId,
      cost
    });
    if (!product)
      return res.status(500).json({
        message: "Database error",
        msg_id: "DB_ERROR",
      });
    return res.status(200).json({
      message: "Product added succesfully!",
      msg_id: "PRODUCT_ADDED",
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const userId = res.locals.user.id
    const userRole = res.locals.user.role
    if (userRole !== 'seller') {
      return res.status(401).json({
        message: "User does not have the right privilige",
        msg_id: "PRODUCT_ROLE_MISSING",
      });
    }
    const id = req.params.id;
    if (!id)
      return res
        .status(404)
        .json({ message: "Product id is missing!", msg_id: "PRODUCT_ID_MISSING" });

    const product = await Product.findOne({ where: { id, sellerId: userId } });
    if (!product)
      return res.status(404).json({
        message: "Product entry not found",
        msg_id: "PRODUCT_ENTRY_NOT_FOUND",
      });
    await Product.destroy({ where: { id, sellerId: userId } });
    return res.status(200).json({
      message: "Product entry deleted succesfully!",
      msg_id: "PRODUCT_DELETED",
      id,
    });
  } catch (error) {
    console.log(error);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["productName", "ASC"]],
    });
  
    return res.status(200).json({ products });
  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      msg_id: "INTERNAL_SERVER_ERROR",
    });    
  }
};

const patchProduct = async (req, res) => {
  try {
    const userId = res.locals.user.id
    const userRole = res.locals.user.role
    if (userRole !== 'seller') {
      return res.status(401).json({
        message: "User does not have the right privilige",
        msg_id: "PRODUCT_ROLE_MISSING",
      });
    }
    const id = req.params.id;
    const { amountAvailable, productName, sellerId, cost } = req.body;

    if (!amountAvailable && !productName && !sellerId && !cost)
      return res.status(400).json({
        message: "Product properties missing",
        msg_id: "PRODUCT_PROPERTIES_MISSING",
      });

    if (!id)
      return res
        .status(404)
        .json({ message: "Product id is missing!", msg_id: "PRODUCT_ID_MISSING" });

    const product = await Product.findOne({ where: { id, sellerId: userId } });
    if (!product)
      return res.status(404).json({
        message: "Product entry not found",
        msg_id: "PRODUCT_ENTRY_NOT_FOUND",
      });

    if (product) {
      await Product.update({amountAvailable, productName, cost }, {
        where: { id },
        returning: true,
        plain: true,
      });

      const updatedProduct = await Product.findOne({ where: { id } });

      return res.status(200).json({
        message: "Product updated succesfully!",
        msg_id: "PRODUCT_UPDATED",
        updatedProduct,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      msg_id: "INTERNAL_SERVER_ERROR",
    });
  }
};

const getProduct = async (req, res) => {
  const id = req.params.id;

  if (!id)
    return res
      .status(404)
      .json({ message: "id is missing!", msg_id: "PPRODUCT_ID_MISSING" });
  const product = await Product.findOne({ where: { id } });
  if (!product)
    return res.status(404).json({
      message: "Product entry not found",
      msg_id: "PRODUCT_ENTRY_NOT_FOUND",
    });

  return res.status(200).json({ product });
};

module.exports = {
  addProduct,
  deleteProduct,
  getProducts,
  patchProduct,
  getProduct,
};
