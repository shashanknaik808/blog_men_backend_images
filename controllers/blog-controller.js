const mongoose = require("mongoose");
const Blog = require("../model/Blog.js");
const User = require("../model/User.js");

//GetAllBlogs
const getAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find().populate("user");
    } catch (err) {
        return console.log(err);
    }
    if (!blogs) {
        return res.status(404).json({ message: "No Blogs Found" });
    }
    return res.status(200).json({ blogs });
}

module.exports = getAllBlogs;