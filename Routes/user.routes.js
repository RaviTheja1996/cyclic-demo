const express = require("express");
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/register", (req, res) => {
  const { username, email, pass } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      if (err) {
        res.status(200).send({ "error": err.message });
      }
      else {
        const user = new UserModel({ username, email, password: hash });
        const new_user = await user.save();
        res.status(200).send({ "msg": "A new user has been registered", "newUser": new_user });
      }
    });
  }
  catch (err) {
    res.status(400).send({ "error": err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(pass, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ username: user.username, userID: user._id }, "raviteja");
          res.status(200).send({ "msg": "logged in successfully", "token": token });
          return;
        }
        if (err) {
          res.status(200).send({ "err": err.message });
        }
      });
    }
    else {
      res.status(200).send({ "msg": "the user doesn't exist please register first" });
    }
  }
  catch (err) {
    res.status(400).send({ "error": err.message });
  }
});

module.exports = { userRouter };