const express = require("express");
const config = require("./config/config");

//middlewares
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const compression = require("compression");
// const errorHandler = require("./middleware/error.js");
// const failSafeHandler = require("./middleware/failsafe");

//utilities
const httpStatus = require("http-status");

const routes = require("./routes/v1");
const db = require("./config/database.js");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const Op = Sequelize.Op;

const JWT_SECRET_KEY = "secretkey";

//test db
db.authenticate()
  .then(() => console.log("db connected"))
  .catch((err) => console.log(`Error: ${err}`));

const app = express();

//middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(xss());
app.use(compression());

// v1 api routes
app.use("/v1", routes);

const PORT = process.env.PORT || 1111;
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
