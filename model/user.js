const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  addcarts: [{ typename: { type: String }, count: { type: Number } }],
  token: { type: String },
});

module.exports = mongoose.model("Users", userSchema);
