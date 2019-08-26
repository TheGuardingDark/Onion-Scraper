const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

require('dotenv').config()

const PORT = process.env.PORT || 27017;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

const routes = require("./controllers");

app.use(routes);


// Connect to the Mongo DB
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrape" 
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const db = mongoose.connection

db.on('error', err => console.log('Mongoose connection error: ${err}'))
db.once('open', () => console.log('Connected to MongoDB'))

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
