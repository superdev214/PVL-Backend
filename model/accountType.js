const mongoose = require("mongoose");

const accountTypeSchema = new mongoose.Schema({
  typename: { type: String, unique: true },
  description: { type: String },
  avatar: {type: String},
  sellCount: {type: Number},
});

module.exports = mongoose.model("AccountType", accountTypeSchema);
