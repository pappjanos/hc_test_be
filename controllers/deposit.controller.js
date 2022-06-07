const User = require("../models/User");

const getDeposit = async (req, res) => {
  try {
    const userId = res.locals.user.id
    const userRole = res.locals.user.role
    if (userRole !== 'buyer') {
      return res.status(401).json({
        message: "User does not have the right privilige",
        msg_id: "PRODUCT_ROLE_MISSING",
      });
    }
    const userState = await User.findOne({ where: { id: userId } });

    return res.status(200).json({
      deposit: userState.dataValues.deposit 
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
  updateDeposit,
  getDeposit,
  resetDeposit
};
