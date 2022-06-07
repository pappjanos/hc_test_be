const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const register = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({message: "Bad request", msg_id:"BAD_REQUEST"})
  }

  try {
    const registeredEmail = await User.findOne({
      where: { email },
    });
    if (registeredEmail) {
      return res
        .status(409)
        .json({ message: "Already registered", msg_id: "ALREADY_REGISTERED" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Database error", msg_id: "DB_ERROR" });
  }

  try {
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      try {
        if (err) throw error;
        const user = await User.create({
          email,
          password: hashedPassword,
          role,
          deposit: 0,
        });
        return user
          ? res.status(200).json({
              message: "Registration successfull!",
              msg_id: "REGISTRATION_SUCCESS",
              user,
            })
          : res
              .status(500)
              .json({ message: "Database error", msg_id: "DB_ERROR" });
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ message: "Database error", msg_id: "DB_ERROR" });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Password hashing error", msg_id: "PW_HASHING_ERROR" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({message: "Bad request", msg_id:"BAD_REQUEST"})
  }
  const user = await User.findOne({
    where: { email },
  });
  if (!user)
    return res
      .status(401)
      .json({ message: "Not registered", msg_id: "NOT_REGISTERED" });

  bcrypt.compare(password, user.dataValues.password, (err, resolve) => {
    if (err) {
      console.log(err);
    }
    if (resolve) {
      jwt.sign(
        { user: user.dataValues },
        config.jwt.secret,
        {
          expiresIn: config.jwt.accessExpirationMinutes,
        },
        (err, token) => {
          return res.status(200).json({ message: "Login succesfull", token });
        }
      );
    } else {
      return res
        .status(401)
        .json({ message: "Password does not match", msg_id: "PWD_NOT_MATCH" });
    }
  });
};

const logout = async (req, res) => {};

module.exports = {
  register,
  login,
  logout,
};
