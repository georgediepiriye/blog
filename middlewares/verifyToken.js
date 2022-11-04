const jwt = require("jsonwebtoken");
const Blog = require("../models/blogModel");

//verify user token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        return res.status(400).json({ error: "Token is not valid" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(400).json({ error: "You are not authenticated" });
  }
};

//verify user token and check if authorized
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, async () => {
    const blog = await Blog.findById(req.params.blogId);
    const owner = blog.author;

    if (req.user.id === owner.toString()) {
      next();
    } else {
      res.status(401).json({ message: "You are not authorized to do this" });
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAuthorization };
