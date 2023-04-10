const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    image: { type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" },
    status: { type: String, default: "Active" },
    country: { type: String },
    number: { type: String}
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", UserSchema);