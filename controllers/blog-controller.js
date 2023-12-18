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

//addBlog
const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body;

    const blog = new Blog({
        title,
        description,
        image,
        user,
    });
    try {
        await blog.save({ session });
    } catch (err) {
        console.log(err);
    }
    return res.status(200).json({ blog });
}
module.exports = addBlog;

//updateBlog
const updateBlog = async (req, res, next) => {
    const { title, description } = req.body;
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description,
        });
    } catch (err) {
        return console.log(err);
    }
    if (!blog) {
        return res.status(500).json({ message: "Unable To Update The Blog" });
    }
    return res.status(200).json({ blog });
};
module.exports = updateBlog;