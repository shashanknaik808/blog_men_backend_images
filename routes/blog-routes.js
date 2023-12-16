const express = require("express");
const getAllBlogs = require("../controllers/blog-controller.js");
const addBlog = require("../controllers/blog-controller.js");

const blogRouter = express.Router();

blogRouter.get("/", getAllBlogs);
blogRouter.post("/add", addBlog);

module.exports = blogRouter;