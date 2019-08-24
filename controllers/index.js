const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models");




// Routes

// Homepage
router.get("/", function(req, res) {
  res.render("index")
})



// A GET route for scraping the onion website
router.get("/scrape", function(req, res) {
    
    axios.get("https://www.theonion.com/").then(function(response) {
     
      var $ = cheerio.load(response.data);
  
      $("div.image-container section").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
          result.title = $(this)
            .find("a")
            .attr("title");
          result.link = $(this)
            .find("a")
            .attr("href");
          result.img = $(this)
            .find("img")
            .attr("src");
          
       console.log(result)
       
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.redirect("/articles");
    });
  });
  
  // Route for getting all Articles from the db
  router.get("/articles", function(req, res) {
    db.Article.find({}).limit(20)
    .populate('note')
    .then(function(dbArticle) {
      var hbsObject = {articles: dbArticle}
      res.render("/", hbsObject)
    })
    .catch(function(err) {
      res.json(err)
    });
    // TODO: Finish the route so it grabs all of the articles
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  router.get("/notes/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle) {
      let note = article.note
      var hbsObject = {noteBody: note}
      res.render('note', hbsObject)
    })
    .catch(function(err) {
      res.json(err)
    });
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
  });
  
  // Route for saving/updating an Article's associated Note
  router.post("/articles/:id", function(req, res) {
    db.Note.create(req.body) 
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {note: dbNote}}, {new: true});
    })
    .then(function(dbArticle) {
      res.redirect("/articles")
    })
    .catch(function(err) {
      res.json(err)
    })
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
  });
  

  module.exports = router;