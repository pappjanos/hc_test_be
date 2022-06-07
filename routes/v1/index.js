const express = require("express");
const authRoute = require("./auth.route");
const productRoute = require("./product.route");
const depositRoute = require("./deposit.route");
const buyRoute = require("./buy.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/product",
    route: productRoute,
  },
  {
    path: "/deposit",
    route: depositRoute,
  },
  {
    path: "/buy",
    route: buyRoute,
  },
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
