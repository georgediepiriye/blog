const Blog = require("../models/blogModel");
const readingTime = require("reading-time");

//create Blog post
const createBlog = async (req, res) => {
  const { title, description, tags, body } = req.body;

  const author = req.user.id;

  if (!title || !body) {
    return res
      .status(400)
      .json({ message: "Please enter title and body fields" });
  }

  //get the reading time from the body sent in
  const stats = readingTime(body);
  try {
    const blog = await Blog.create({
      title: title,
      description: description,
      tags: tags,
      author: author,
      reading_time: stats.time,
      body: body,
    });

    if (blog) {
      res.status(200).json({ status: true, blog });
    } else {
      res.status(404).json({ message: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
  }
};

//get all published blogs
const getAllPublishedBlogs = async (req, res) => {
  const { query } = req;

  const {
    per_page = 20,
    author,
    title,
    tags,
    order = "asc",
    order_by = "createdAt",
  } = query;
  const page = req.query.page || 0;

  try {
    const findQuery = {};
    findQuery.state = "published";

    if (author) {
      findQuery.author = author;
    }

    if (title) {
      findQuery.title = title;
    }

    if (tags) {
      findQuery.tags = tags;
    }

    const sortQuery = {};

    const sortAttributes = order_by.split(",");

    for (const attribute of sortAttributes) {
      if (order === "asc" && order_by) {
        sortQuery[attribute] = 1;
      }

      if (order === "desc" && order_by) {
        sortQuery[attribute] = -1;
      }
    }

    const blogs = await Blog.find(findQuery)
      .sort(sortQuery)
      .skip(page * per_page)
      .limit(per_page);
    if (blogs.length > 0) {
      return res.status(200).json({ status: true, blogs });
    } else {
      return res.status(400).json({ status: false, message: "No blog found!" });
    }
  } catch (error) {
    console.log(error);
  }
};

//get single published blog
const getSingleBlog = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await Blog.findById(blogId).populate("author");
    if (blog) {
      //increase the read count
      await Blog.updateOne(blog, {
        $set: {
          read_count: blog.read_count + 1,
        },
      });
      return res.status(200).json({ status: true, blog });
    } else {
      return res.status(400).json({ status: false, message: "No blog found!" });
    }
  } catch (error) {
    console.log(error);
  }
};

//update blog to published
const updateBlogToPublished = async (req, res) => {
  try {
    const id = req.params.blogId;
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $set: { state: "published" },
      },
      { new: true }
    );
    if (updatedBlog) {
      return res.status(201).json({
        status: true,
        message: "Blog updated Successfully",
        updatedBlog,
      });
    } else {
      return res
        .status(404)
        .json({ status: false, blog: null, message: "Blog not updated" });
    }
  } catch (error) {
    console.log(error);
  }
};

//edit blog
const editBlog = async (req, res) => {
  try {
    const id = req.params.blogId;

    const { title, description, tags, body } = req.body;

    //get the reading time from the body sent in
    const stats = readingTime(body);

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $set: {
          title: title,
          description: description,
          tags: tags,
          reading_time: stats.time,
          body: body,
        },
      },
      { new: true }
    );
    if (updatedBlog) {
      return res.status(201).json({
        status: true,
        message: "Blog updated Successfully",
        updatedBlog,
      });
    } else {
      return res
        .status(404)
        .json({ status: false, blog: null, message: "Blog not updated" });
    }
  } catch (error) {
    console.log(error);
  }
};

//delete blog
const deleteBlog = async (req, res) => {
  const id = req.params.blogId;
  try {
    const blog = await Blog.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ status: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

//get all blogs for a user
const getUserBlogs = async (req, res) => {
  const { query } = req;

  const { per_page = 20 } = query;
  const state = query.state || "published";
  const page = query.page || 0;

  const author = req.user.id;
  try {
    console.log(state)
    const blogs = await Blog.find({
      author: author,
      state: state,
    })
      .skip(page * per_page)
      .limit(per_page);
      
    if (blogs.length > 0) {
      return res.status(200).json({ status: true, blogs });
    } else {
      return res.status(400).json({ status: false, message: "No blog found" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createBlog,
  getAllPublishedBlogs,
  getSingleBlog,
  updateBlogToPublished,
  editBlog,
  deleteBlog,
  getUserBlogs,
};
