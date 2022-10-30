const User = require("../models/userModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register User
const registerUser = async (req, res) => {
  try {
    //check if user with the username already exists
    const checkUser = await User.findOne({ username: req.body.username });
    if (checkUser) {
      return res
        .status(400)
        .json({ message: "User with this username already exists" });
    }

    const user = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SECRET
      ).toString(),
    });

    if (user) {
      return res
        .status(201)
        .json({ message: "Registration succesful", user: user });
    } else {
      return res.status(401).json({ message: "Something went wrong!" });
    }
  } catch (error) {
    console.log(error);
  }
};

//login
const login = async (req, res) => {
  try {
    //check if user with username exists n database
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({
        message: "wrong credentials",
      });
      return;
    }

    //get plain passport of user in database
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password) {
      return res.status(401).json({
        error: "wrong credentials",
      });
      return;
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SEC,
      { expiresIn: "1hr" }
    );

    const { password, ...others } = user._doc;

    return res.status(200).json({ ...others, accessToken });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { registerUser, login };
