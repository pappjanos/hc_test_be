const User = require("../models/User");
const Product = require("../models/Product");

const amountTocoins = (amount, coins) => {
  if (amount === 0) {
    return [];
  }
  else {
    if (amount >= coins[0]) {
      left = (amount - coins[0]);
      return [coins[0]].concat(amountTocoins(left, coins));
    }
    else {
      coins.shift();
      return amountTocoins(amount, coins);
    }
  }
} 

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
    
    await User.update({ deposit: balanceAfterCheckout }, {
      where: { id: userId },
      returning: true,
      plain: true,
    });

    return res.status(200).json({
      currentCheckout,
      productName,
      balanceAfterCheckout,
      coins: amountTocoins(balanceAfterCheckout, [100, 50, 20, 10, 5])
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

const updateDeposit = async (req, res) => {
  try {
    const userId = res.locals.user.id
    const userRole = res.locals.user.role
    if (userRole !== 'buyer') {
      return res.status(401).json({
        message: "User does not have the right privilige",
        msg_id: "PRODUCT_ROLE_MISSING",
      });
    }

    const { deposit } = req.body;

    if (!deposit || deposit !== 5 && deposit !== 10 && deposit !== 20 && deposit !== 50 && deposit !== 100)
      return res.status(400).json({
        message: "Deposit shall be 5, 10, 20, 50 or 100",
        msg_id: "DEPOSIT_ERROR",
    });

    const userCurrentState = await User.findOne({ where: { id: userId } });

    await User.update({deposit: userCurrentState.dataValues.deposit + deposit }, {
      where: { id: userId },
      returning: true,
      plain: true,
    });

    const updatedUserState = await User.findOne({ where: { id: userId } });

    return res.status(200).json({
      message: "Deposit updated succesfully!",
      msg_id: "DEPOSIT_UPDATED",
      deposit: updatedUserState.dataValues.deposit,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      msg_id: "INTERNAL_SERVER_ERROR",
    });
  }
};

const resetDeposit = async (req, res) => {
  try {
    const userId = res.locals.user.id
    const userRole = res.locals.user.role
    if (userRole !== 'buyer') {
      return res.status(401).json({
        message: "User does not have the right privilige",
        msg_id: "PRODUCT_ROLE_MISSING",
      });
    }

    await User.update({deposit: 0 }, {
      where: { id: userId },
      returning: true,
      plain: true,
    });

    const updatedUserState = await User.findOne({ where: { id: userId } });

    return res.status(200).json({
      message: "Deposit reseted succesfully!",
      msg_id: "DEPOSIT_RESETED",
      deposit: updatedUserState.dataValues.deposit,
    });
  } catch (error) {
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
