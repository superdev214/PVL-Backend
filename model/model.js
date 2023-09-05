
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TutorialSchema = new Schema({
  title: String,
  description: String,
  published: Boolean
})
 module.exports = mongoose.model('TutorialSchema',TutorialSchema);