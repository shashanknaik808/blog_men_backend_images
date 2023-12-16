const express = require('express');
const { getAllUser, signup } = require('../controllers/user-controller');

const router = express.Router();

router.get("/", getAllUser);
router.post("/signup", signup);

module.exports = router;