const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);
module.exports = User;
