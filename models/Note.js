var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//create new schema object
var NoteSchema = new Schema({
  
  title: String,
  
  body: String
});

//creates model from schema
var Note = mongoose.model("Note", NoteSchema);

// Exports the Note model
module.exports = Note;
