const express = require('express');
const {
    getAllUser,
    signup,
    login,
    retrive
} = require("../controllers/user-controller.js");


const userRouter = express.Router();

userRouter.get("/", getAllUser);
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get('/:id', retrive)

module.exports = userRouter;