const express = require("express");
const getAllBlogs = require("../controllers/blog-controller.js");

const blogRouter = express.Router();

blogRouter.get("/", getAllBlogs);

module.exports = blogRouter;