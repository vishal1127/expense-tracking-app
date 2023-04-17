const User = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists", success: false });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });
  newUser.save().then((result) => {
    res
      .status(200)
      .json({ message: "New user created", success: true, newUser: result });
  });
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    console.log("exisifnff---------", existingUser);
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Password is incorrect",
        success: false,
      });
    }
    const token = await jwt.sign(
      {
        email: email,
        id: existingUser._id,
      },
      SECRET_KEY
    );
    res
      .status(200)
      .json({ message: "Login successful", user: existingUser, token: token });
  } else {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }
};
