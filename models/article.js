var mongoose = require('mongoose');
var Schema = mongoose.Schema; //lets us use mongoose's Schema functionality

var ArticleSchema = new Schema({ //articles will have these things
	title:String, //title will be a string
	body:String, //body will be a string
	tags:[String],
	createdAt:{type:Date,default:Date.now} //createdAt will be a date; by default, it will be the time it is created
});

mongoose.model('article',ArticleSchema); //exports the Schema for use, as mongoose.model('article')