const mongoose = require("mongoose");
const Blog = require("../model/Blog");
const User = require("../model/User");
const path = require('path');
const fs = require('fs');


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


// addBlog
module.exports.addBlog = async (req, res, next) => {
    const { title, description, userID } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const { image } = req.files;

    if (image.size > 100000) {
        return res.status(405).json({ message: "Size of the image cannot be more than 9000kb", soi: image.size });
    }

    let imgName = image.name.split('.');
    if (!(imgName[1] === 'png' || imgName[1] === 'jpg')) {
        return res.status(401).json({ message: 'Please select a valid format png or jpg' });
    }

    let uploadPath;
    let date = new Date();
    let newFileName = "img_" +
        date.getDate() +
        (date.getMonth() + 1) +
        date.getFullYear() +
        date.getHours() +
        date.getMinutes() +
        date.getSeconds() +
        date.getMilliseconds() +
        '.jpg';

    uploadPath = path.join(__dirname, '..', 'upload', newFileName);

    console.log(uploadPath);

    if (!fs.existsSync(path.dirname(uploadPath))) {
        fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
    }

    let existingUser;
    try {
        existingUser = await User.findById(userID);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error finding user by ID' });
    }

    if (!existingUser) {
        return res.status(400).json({ message: 'Unable to find user by this ID' });
    }

    const blog = new Blog({
        title,
        description,
        image: '/photo/' + newFileName,
        user: userID,
    });

    try {
        await image.mv(uploadPath);

        const session = await mongoose.startSession();
        session.startTransaction();

        await blog.save({ session });
        existingUser.blogs.push(blog);
        await existingUser.save({ session });

        await session.commitTransaction();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }

    return res.status(200).json({ blog });
};



//updateBlog
module.exports.updateBlog = async (req, res, next) => {
    const { title, description } = req.body;

    const blogId = req.params.id;
    //console.log(req.files);


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(404).json({ message: 'No files were uploaded.' });
    }

    const { image } = req.files;

    if (image.size > 100000)
        return res.status(405).json({ message: "Size of the image cannot be more than 9000kb", soi: image.size });

    let imgName = image.name.split('.');
    if (!(imgName[1] === 'png' || imgName[1] === 'jpg'))
        return res.status(401).json({ message: 'Please select a valid format png or jpg' });


    let blog;
    try {
        blog = await Blog.findById(blogId);
    } catch (e) {
        console.log(e);
        return res.status(503).json({ message: 'Error while fetching old blog' });
    }

    if (!blog)
        return res.status(403).json({ message: 'Please check the blog ID' });

    let uploadPath;
    let date = new Date();
    let newFileName = "img_" +
        date.getDate() +
        (date.getMonth() + 1) +
        date.getFullYear() +
        date.getHours() +
        date.getMinutes() +
        date.getSeconds() +
        date.getMilliseconds() +
        '.jpg';


    blog.title = title;
    blog.description = description;
    blog.image = '/photo/' + newFileName;


    uploadPath = path.join(__dirname, '..', '/upload', newFileName);
    console.log(uploadPath);


    image.mv(uploadPath, async (err) => {
        if (!err) {
            try {
                await blog.save();
            }
            catch (error) {
                console.log(error);
                return res.status(502).json({ message: "Error while updating blog on Mongo" })
            }
        }
        else {
            console.error(err);
            return res.status(501).json({ message: "Image could not be uploaded, Please retry again" });
        }
    });


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
        blog = await Blog.findByIdAndDelete(id).populate("user");
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