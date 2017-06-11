//require mongoose
var mongoose = require("mongoose");
//create schema class
var Schema = mongoose.Schema;

//create article schema
var ArticleSchema = new Schema ({
	title: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	comment: [{
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}, ]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;