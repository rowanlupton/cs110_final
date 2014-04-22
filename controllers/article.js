var mongoose = require('mongoose'),
		Article = mongoose.model('article'), //articles look like what I made in the models/article.js file
		controller = {};

/*

things with a function(err) {} are running a function; if there is an error, it is passed (otherwise, it's NULL)

*/

//this is necessary to make it work
controller.load = function(req,res,next,id) {
	Article.findById(id).exec(function(err,article) {
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
			res.render('article/index',{articles:articles}); //render the index ejs file, with article as the key for the articles variable
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
		res.locals.title = "index of tag: "+req.params.tagID;
		console.log(req.params.tagID);
		Article.find({'tags':req.params.tagID},function(err,articles) {
			if(err) throw err;
			console.log(articles);
			res.render('article/tagIndex',{articles:articles});
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
		console.log("splitting tags");
		req.body.tags = req.body.tags.split(",");
		console.log("tags are split (I think)");
		next();
	},
	function(req,res,next) { //create the article in the database
		Article.create(req.body,function(err) { //create the article
			if(err) throw err;
			res.redirect("/articles"); //redirect to the index page
		});
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