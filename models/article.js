var mongoose = require('mongoose');
var Schema = mongoose.Schema; //lets us use mongoose's Schema functionality

var ArticleSchema = new Schema({ //articles will have these things
	title:String, //title will be a string
	body:String, //body will be a string
	createdAt:{type:Date,default:Date.now}, //createdAt will be a date; by default, it will be the time it is created,
	tags:[{type:Schema.Types.ObjectId,ref:'tag'}]
});

ArticleSchema.pre('save',function(next,done) {
	
	next();
})

mongoose.model('article',ArticleSchema); //exports the Schema for use, as mongoose.model('article')

//mongoose.model('article').find({...}).populate('tags')