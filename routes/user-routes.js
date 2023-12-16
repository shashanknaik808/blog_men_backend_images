const express = require('express');
const getAllUser = require("../controllers/user-controller.js");
const signup = require("../controllers/user-controller.js");

const router = express.Router();

router.get("/", getAllUser);
router.post("/signup", signup);

module.exports = router;