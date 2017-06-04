//require mongoose
var mongoose = require("mongoose");
//create schema class
var Schema = mongoose.Schema;

//create comment schema
var CommentSchema = new Schema ({
	title: {
		type: String
	},
	body: {
		type: String
	}
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;