var mongoose = require('mongoose'),
		_ = require('lodash'),
		async = require('async'),
		Article = mongoose.model('article'), //articles look like what I made in the models/article.js file
		Tag = mongoose.model('tag'),
		controller = {};

/*

things with a function(err) {} are running a function; if there is an error, it is passed (otherwise, it's NULL)

*/

//this is necessary to make it work
controller.load = function(req,res,next,id) {
	Article.findById(id).populate('tags').exec(function(err,article) {
		//populate('tags') lets you access tags by index value, instead of just throwing the id
		if(err) throw err;
		if(!article) return res.send(404);
		req.article = article;
		next();
	});
};




//index
//in an array so that there are separate functions, without declaring them all separately
controller.index = [
	function(req,res,next) {
		console.log("CALLED index");
		next();
	},
	function(req,res,next) { //request, response, next function (to run through the array)
		res.locals.title = "index";
		Article.find({},function(err,articles) { //looks for ALL of the things in the articles variable
			if(err) throw err; //if there was an error, stop (and tell me what the error was)
			Tag.find({},function(err,tags) {
				res.render('article/index',{articles:articles, tags:tags}); //render the index ejs file, with article as the key for the articles variable
			});
		});
	}
];


//viewTag
//views a list of articles for a given tag
controller.viewTag = [
	function(req,res,next) {
		console.log("CALLED viewTag");
		next();
	},
	function(req,res,next) {
		res.locals.title = "tag index";
		Tag.find({id:req.params.tagID},function(err,tag) {
			Article.find({id:tag.articles},function(err,articles) {
				res.render('article/tagIndex',{articles:articles});
			});
		});
	}
];


//view
controller.view = [
	function(req,res,next) {
		console.log("CALLED view");
		next();
	},
	function(req,res,next) {
		res.locals.title = req.article.title;
		res.render('article/view',{article:req.article}); //renders view.ejs with the requested article
	}
];



//write
controller.write = [
	function(req,res,next) {
		console.log("CALLED write");
		next();
	},
	function(req,res,next) {
		res.locals.title = "write a new post";
		console.log('write function called');
		res.render('article/new');
	}
];

//create
controller.create = [
	function(req,res,next) {
		console.log("CALLED create");
		next();
	},
	function(req,res,next) { //validate the pending article
		if("title" in req.body && req.body.name !== '') { //if there is a title and a name for the article
			next(); //call the next function, to add it to the database
		} else {
			res.send(400); //error, leave the array of functions
		}
	},
	function(req,res,next) {
		req.tags = _.uniq(req.body.tags.split(',').map(function(tag) {
			return tag.toLowerCase();
		}));
		delete req.body.tags;
		next();
	},
	function(req,res,next) { //create the article and tags in the database, assign tags to article
		var article = new Article(req.body);
		var toCreate = []; //array of functions to create tags, that should be run in the callback function
		
		//prep for creating tags
		req.tags.forEach(function(tagName) {
			toCreate.push(function(callback) { //push functions into toCreate
																				//each function will create one new tag when it's called
				Tag.findOrCreate({name:tagName},function(err,tag,created) {
					//err etc
					tag.articles.push(article._id);
					tag.save();
					if(err) return callback(err);
					//calls async's function callback, passing no error and the tag id
					callback(null,tag.id);
				});
			});
		});

		//runs all functions in toCreate, and when it finishes, runs the callback
		async.parallel(toCreate,function(err,tagIds) {
			if(err) return err;
			tagIds.forEach(function(tagId) {
				article.tags.push(tagId);
			});

			console.log("out of the forEach");
			
			article.save(function(err,article) {
				if (err) throw err;
				// console.log(tag);
				res.redirect('/articles');
			});
		});
		//results will be an array of object ids
		//put the tagIds in the article
		//save the article article.save(function(err, article) {res.redirect(/articles)});
	}	
];




//edit
controller.edit = [
	function(req,res,next) {
		console.log("CALLED edit");
		next();
	},
	function(req,res,next) {
		res.locals.title = "edit post \""+req.article.title+"\"";
		console.log("edit function");
		res.render("article/edit",{article:req.article});
	}
];





//update
controller.update = [
	function(req,res,next) {
		console.log("CALLED update");
		next();
	},
	function(req,res,next) {
		console.log("splitting tags");
		req.body.tags = req.body.tags.split(",");
		console.log("tags are split (I think)");
		next();
	},
	function(req,res,next) {
		for(key in req.body) { //for each key (to an entry) in body
			req.article[key] = req.body[key]; //assign body[that key] to the respective place in article
		}
		req.article.save(function(err,article) { //save a new thing as the req.article
			res.redirect("/articles/"+article.id); //respond with the updated article as a json
		});
	}
];



//delete
controller.delete = [
	function(req,res,next) {
		console.log("CALLED delete");
		next();
	},
	function(req,res,next) {
		console.log("delete function called");
		req.article.remove(function(err) { //remove the requested article
			if(err) throw err; //error case
			res.send(201); //send a response saying that it worked
		});
		next();
	},
	function(req,res,next) {
		res.redirect("/articles/");
	}
];

module.exports = controller; //allows other files to access controller and the arrays it's holding