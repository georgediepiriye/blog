const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const blogSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    state: { type: String, enum: ["draft", "published"], default: "draft" },
    read_count: { type: Number, default: 0 },
    reading_time: { type: Number },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
blogSchema.plugin(uniqueValidator);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
