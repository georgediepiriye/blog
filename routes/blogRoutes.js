const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const {
  createBlog,
  getAllPublishedBlogs,
  getSingleBlog,
  updateBlogToPublished,
  editBlog,
  deleteBlog,
  getUserBlogs,
} = require("../controllers/blogController");

router.get("/all", verifyToken, getUserBlogs);
router.get("/published", getAllPublishedBlogs);
router.get("/:blogId", getSingleBlog);
router.post("/", verifyToken, createBlog);
router.patch(
  "/update/:blogId",
  verifyTokenAndAuthorization,
  updateBlogToPublished
);
router.patch("/:blogId", verifyTokenAndAuthorization, editBlog);
router.delete("/:blogId", verifyTokenAndAuthorization, deleteBlog);

module.exports = router;
