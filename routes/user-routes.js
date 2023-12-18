const express = require('express');
const {
    getAllUser,
    signup,
    login
} = require("../controllers/user-controller.js");

const userRouter = express.Router();

userRouter.get("/", getAllUser);
userRouter.post("/signup", signup);
userRouter.post("/login", login);

module.exports = userRouter;