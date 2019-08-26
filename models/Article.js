const mongoose = require("mongoose");

// Saves a reference to the Schema constructor
const Schema = mongoose.Schema;

// creates a new UserSchema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  img: String,
  saved: {
    type: Boolean,
    default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// creates model from schema
var Article = mongoose.model("Article", ArticleSchema);

// Exports the Article model
module.exports = Article;
