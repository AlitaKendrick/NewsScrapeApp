// dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
// comment and article models
var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");
// scraping
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

// initialize Express
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

// db configuration with mongoose
mongoose.connect("mongodb://localhost/newsapp");
var db = mongoose.connection;

// show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

app.get("/scrape", function(req, res){
  request("https://hbr.org/the-latest", function(error, response, html){
    var $ = cheerio.load(html);
    $("h3.hed").each(function(i, element) {
      var result = {};

     result.title = $(this).children("a").text();
     result.link = $(this).children("a").attr("href");
 
      var entry = new Article(result);
      var entry = new Article(result);

      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});

// get the articles scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  Article.findOne({ "_id": req.params.id })
//populate comments
  .populate("comment")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});


// create a comment
app.post("/articles/:id", function(req, res) {
  var newComment = new Comment(req.body);

  // save new comment
  newComment.save(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      // find article update comment
      Article.findOneAndUpdate({ "_id": req.params.id }, { "comment": doc._id })
      .exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
    }
  });
});


// listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
