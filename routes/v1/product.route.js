const express = require("express");
const productController = require("../../controllers/product.controller");
const router = express.Router();
const {verifyToken} = require("../../utils/jwt");

router
  .post("", verifyToken, productController.addProduct)
  .delete("/:id", verifyToken, productController.deleteProduct)
  .get("", verifyToken, productController.getProducts)
  .patch("/:id", verifyToken, productController.patchProduct)
  .get("/:id", verifyToken, productController.getProduct);

module.exports = router;
