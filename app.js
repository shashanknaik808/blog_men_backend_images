const express = require('express');
const mongoose = require('mongoose');
const userRouter = require("./routes/user-routes.js");
const blogRouter = require("./routes/blog-routes.js");

const app = express();
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);

mongoose
    .connect(
        "mongodb+srv://shashanknaik808:qwerty123456@cluster0.rz6q9l5.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => app.listen(5000))
    .then(() =>
        console.log("Connected TO Database and Listening TO Localhost 5000")
    )
    .catch((err) => console.log(err));