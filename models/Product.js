const { DataTypes, Model } = require("sequelize");
const db = require("../config/database.js");

class Product extends Model { }

Product.init(
  {
    amountAvailable: {
      type: DataTypes.INTEGER,
    },
    productName: {
      type: DataTypes.STRING,
    },
    sellerId: {
      type: DataTypes.STRING,
    },
    cost: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: "product",
    freezeTableName: true,
  }
);

module.exports = Product;
