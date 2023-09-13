const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  typename: { type: String},
  email: { type: String },
  password: {type: Number},
  reserve: {type:Boolean, type:false}
});

module.exports = mongoose.model("Account", accountSchema);
