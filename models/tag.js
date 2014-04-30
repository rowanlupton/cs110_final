var mongoose = require('mongoose'),
		findOrCreate = require('mongoose-findorcreate');
var Schema = mongoose.Schema; //lets us use mongoose's Schema functionality

var TagSchema = new Schema({ //tags will have these things
	name:String,
	createdAt:{type:Date,default:Date.now}, //createdAt will be a date; by default, it will be the time it is created
	articles:[{type:Schema.Types.ObjectId,ref:'article'}]
});

TagSchema.plugin(findOrCreate);

mongoose.model('tag',TagSchema); //exports the Schema for use, as mongoose.model('tag')