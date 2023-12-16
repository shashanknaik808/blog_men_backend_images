const express = require('express');
const getAllUser = require("../controllers/user-controller.js");
const signup = require("../controllers/user-controller.js");
const login = require("../controllers/user-controller.js");

const router = express.Router();

router.get("/", getAllUser);
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;