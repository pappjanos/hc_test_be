const express = require("express");
const authController = require("../../controllers/auth.controller");
const { verifyToken } = require("../../utils/jwt");

const router = express.Router();

router
  .post("/register", authController.register)
  .post("/login", authController.login)
  .post("/logout", verifyToken, authController.logout)

module.exports = router;
