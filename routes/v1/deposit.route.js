const express = require("express");
const depositController = require("../../controllers/deposit.controller");
const router = express.Router();
const {verifyToken} = require("../../utils/jwt");

router
  .post("", verifyToken, depositController.updateDeposit)
  .get("", verifyToken, depositController.getDeposit)
  .delete("/reset", verifyToken, depositController.resetDeposit)

module.exports = router;
