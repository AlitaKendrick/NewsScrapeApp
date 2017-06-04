
// dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//require commend and article models
var Comment = require("./models/comment.js");
var Article = require("./models/article.js");
//scraping 
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

var app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

//databse config with mongoose
mongoose.connect("mongodb://localhost/newsScrapeApp");
var db = mongoose.connection;

//show mongoose errs
db.on("error", function(error){
	console.log("Mongoose Error: " + error);
});

db.once("open", function(){
	console.log("Mongoose connection was successful");
});


//ROUTES

//scrape website
app.get("/scrape", function(request, response){
	request("https://hbr.org/the-latest", function(error, response, html){
		var $cheerio = cheerio.load(html);
		$("h3.hed").each(function(i, element) {
			var result = {};

			result.title = $(this).children("a").text();
			result.link = $(this).children("a").attr("href");

			var entry = new Article(result);

			entry.save(function(err, doc){
				if (err) {
					console.log(err);
				}
				else {
					console.log(doc);
				}
			});
		});
	});
	res.send("Scrape complete!");
});

app.get("/articles", function(request, response) {
	Article.findOne({ "_id": req.params.id })
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

app.post("/articles/:id", function(req, res) {
	var newComment = new Comment(req.body);

	newComment.save(function(error, doc) {
		if (error) {
			console.log(error);
		} 
		else {
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

app.listen(3000, function() {
	console.log("App running on port 3000");
});




