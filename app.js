const express = require("express");

//middlewares
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const compression = require("compression");
const logger = require("./middleware/logger");

//utilities
const routes = require("./routes/v1");
const db = require("./config/database.js");

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
app.use(logger());

app.use("/v1", routes);

const PORT = process.env.PORT || 1111;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
  });
}


module.exports = app