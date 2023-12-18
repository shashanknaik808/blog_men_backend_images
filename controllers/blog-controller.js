const mongoose = require("mongoose");
const Blog = require("../model/Blog");
const User = require("../model/User");

//getAllBlogs
module.exports.getAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find({}).populate("user");
    } catch (err) {
        return console.log(err);
    }
    if (!blogs) {
        return res.status(404).json({ message: "No Blogs Found" });
    }
    return res.status(200).json({ blogs });
};


//addBlog
module.exports.addBlog = async (req, res, next) => {
    console.log(req.body);
    console.log(req.files);

    const { title, description, user } = req.body;
    const { image } = req.files;
    let sampleFile;
    let uploadPath;
    let date = new Date()

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    sampleFile = req.files.sampleFile;
    let newFileName = "img_" +
        date.getDate() +
        (date.getMonth() + 1) +
        date.getFullYear() +
        date.getHours() +
        date.getMinutes() +
        date.getSeconds() +
        date.getMilliseconds() +
        '.jpg';
    uploadPath = __dirname + '/upload/' + newFileName;
    console.log(newFileName);

    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (err) {
        return console.log(err);
    }
    if (!existingUser) {
        return res.status(400).json({ message: "Unable TO Find User By This ID" });
    }
    const blog = new Blog({
        title,
        description,
        image: newFileName,
        user,
    });
    try {
        const session = await mongoose.startSession();
        session.startTransaction({ session });
        await blog.save({ session });
        existingUser.blogs.push(blog);
        await existingUser.save({ session });
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }

    return res.status(200).json({ blog });
};


//updateBlog
module.exports.updateBlog = async (req, res, next) => {
    const { title, description } = req.body;
    const { image } = req.files
    const blogId = req.params.id;

    let sampleFile;
    let uploadPath;
    let date = new Date()

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    sampleFile = req.files.sampleFile;
    let newFileName = "img_" +
        date.getDate() +
        (date.getMonth() + 1) +
        date.getFullYear() +
        date.getHours() +
        date.getMinutes() +
        date.getSeconds() +
        date.getMilliseconds() +
        '.jpg';
    uploadPath = __dirname + '/upload/' + newFileName;
    console.log(newFileName);

    let blog;
    try {
        await Blog.updateOne({ "_id": blogId }, {
            title: title,
            description: description,
            image: newFileName,
        });
        blog = await Blog.findById(blogId);
    } catch (err) {
        return console.log(err);
    }
    if (!blog) {
        return res.status(500).json({ message: "Unable To Update The Blog" });
    }

    return res.status(200).json({ blog });
};


// getById
module.exports.getById = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findById(id).populate('user');
    } catch (err) {
        return console.log(err);
    }
    if (!blog) {
        return res.status(404).json({ message: "No Blog Found" });
    }
    return res.status(200).json({ blog });
};


// deleteBlog
module.exports.deleteBlog = async (req, res, next) => {
    const id = req.params.id;

    let blog;
    try {
        blog = await Blog.findByIdAndRemove(id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save({});
    } catch (err) {
        console.log(err);
    }
    if (!blog) {
        return res.status(500).json({ message: "Unable To Delete" });
    }
    return res.status(200).json({ message: "Successfully Delete" });
};


// getByUserId
module.exports.getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate("blogs");
    } catch (err) {
        return console.log(err);
    }
    if (!userBlogs) {
        return res.status(404).json({ message: "No Blog Found" });
    }
    return res.status(200).json({ user: userBlogs });
};