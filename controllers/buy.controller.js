const User = require("../models/User");
const Product = require("../models/Product");
const amountToCoins = require("../utils/amountToCoins");

const buyProduct = async (req, res) => {
  try {
    const userId = res.locals.user.id
    const userRole = res.locals.user.role
    const { id, amount } = req.body;

    if (userRole !== 'buyer') {
      return res.status(401).json({
        message: "User does not have the right privilige",
        msg_id: "PRODUCT_ROLE_MISSING",
      });
    }

    if (!id || !amount)
      return res.status(400).json({
        message: "Product properties missing",
        msg_id: "PRODUCT_PROPERTIES_MISSING",
    });

    const userState = await User.findOne({ where: { id: userId } });
    const currentDeposit = userState.dataValues.deposit

    const selectedProduct = await Product.findOne({ where: { id } });
    if (!selectedProduct) {
      return res.status(404).json({
        message: "Product is missing",
        msg_id: "PRODUCT_MISSING",
      });      
    }
    const productPrice = selectedProduct.dataValues.cost
    const productAmountAvailable = selectedProduct.dataValues.amountAvailable
    const productName = selectedProduct.dataValues.productName
    const currentCheckout = productPrice * amount

    if (amount > productAmountAvailable) {
      return res.status(400).json({
        message: "Not enough products",
        msg_id: "NOT_ENOUGH_PRODUCTS",
      });        
    }

    if (currentCheckout > currentDeposit) {
      return res.status(400).json({
        message: "Insufficient funds",
        msg_id: "INSUFFICIENT_FUNDS",
      });        
    }

    const balanceAfterCheckout = currentDeposit - currentCheckout
    
    await Product.update({ amountAvailable: productAmountAvailable - amount }, {
      where: { id },
      returning: true,
      plain: true,
    });
    
    await User.update({ deposit: 0 }, { //balanceAfterCheckout
      where: { id: userId },
      returning: true,
      plain: true,
    });

    return res.status(200).json({
      amount,
      currentCheckout,
      productName,
      // balanceAfterCheckout,
      changeAmount: balanceAfterCheckout,
      changeCoins: amountToCoins(balanceAfterCheckout, [100, 50, 20, 10, 5])
    });
  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      msg_id: "INTERNAL_SERVER_ERROR",
    });    
  }
};

module.exports = {
  buyProduct,
};
