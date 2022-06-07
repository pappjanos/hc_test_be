const express = require("express");
const buyController = require("../../controllers/buy.controller");
const router = express.Router();
const verifyToken = require("../../utils/jwt");

router
  .post("", verifyToken, buyController.buyProduct)

module.exports = router;
