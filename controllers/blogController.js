const Blog = require("../models/blogModel");

//create Blog post
const createBlog = async (req, res) => {
  const { title, description, tags, author, reading_time, body } = req.body;
  try {
    if (!title || !body) {
      res
        .status(400)
        .json({ status: false, msg: "Please enter title and body field" });
    }

    const blog = await Blog.create({
      title: title,
      description: description,
      tags: tags,
      author: author,
      reading_time: now,
      body: body,
    });

    if (blog) {
      res.status(200).json({ status: true, blog });
    } else {
      res.status(404).json({ status: false, msg: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createBlog };
