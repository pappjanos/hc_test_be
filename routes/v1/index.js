const express = require("express");
const authRoute = require("./auth.route");
const blogRoute = require("./blog.route");
const productRoute = require("./product.route");
const depositRoute = require("./deposit.route");
const buyRoute = require("./buy.route");
const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/blog",
    route: blogRoute,
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
