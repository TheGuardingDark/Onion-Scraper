const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
// const atob = require("atob");
// const Blob = require("blob");
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
  
      $("article").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
          result.title = $(this)
            .find("div.kExJtn")
            .find("a")
            .find("h1")
            .text()
          result.link = $(this)
            .find("figure")
            .find("a")
            .attr("href");
            result.img = $(this)
            .find('figure')
            .find("img")
            .attr("src")

            
            // console.log(result)
       
  
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
    db.Article.find({})
    .populate('note')
    .then(function(dbArticle) {
      var hbsObject = {articles: dbArticle}
      res.render("index", hbsObject)
    })
    .catch(err => res.json(err))
  });

  //route to add/update note and attach to article
  router.post('/articles/:id', function(req, res) {
    db.Note.create(req.body)
    .then(note => db.Article.findOneAndUpdate({_id: req.params.id}, {note: note._id}, {new: true})).then(() => {
      res.redirect('/articles')
    })
    .catch(err => res.json(err))
  });


  // Route for grabbing a specific Article by id, with its note
  router.get("/articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle) {
      let note = dbArticle.note
      let article = dbArticle
      var hbsObject = {arttitle: article.title, title: note.title, body: note.body, id: note._id}
      res.render('note', hbsObject)
    })
    .catch(err => res.json(err))
  });

  //route to save article
  router.get('/saved/:id', (req, res) => {
    db.Article.findByIdAndUpdate(req.params.id, {$set: {saved: true}}, {new: true})
    .then( () => res.redirect('/articles'))
    .catch(err => res.json(err));
  });

  //route to remove article from saved
  router.get('/remove/:id', (req, res) => {
    db.Article.findByIdAndUpdate(req.params.id, {$set: {saved: false}}, {new: true})
    .then(() => res.redirect('/articles'))
    .catch(err => res.json(err));
  });


//route to grab all saved articles
  router.get('/saved', (req, res) => {
    db.Article.find({saved: true})
    .then(result => {
      var hbsObject = {article: result}
      res.render('saved', hbsObject);
    })
    .catch(err => res.json(err))
  });

  //route to delete an article's note
  router.get('/note/delete/:id', (req, res) => {
    db.Note.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('/articles'))
    .catch(err => res.json(err))
  });

  //route to delete article
  router.get('/article/delete/:id', (req, res) => {
    db.Article.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('/articles'))
    .catch(err => res.json(err))
  });

  

  module.exports = router;