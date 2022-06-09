const { DataTypes, Model } = require("sequelize");
const db = require("../config/database.js");

class User extends Model { }

User.init(
  {
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    deposit: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: "user",
    freezeTableName: true,
  }
);

module.exports = User;
