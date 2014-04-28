var express = require('express'),
		app = express(),
		port = process.env.PORT || 8080, //uses heroku's provided port if it exists; otherwise, 8080
		mongoose = require('mongoose');

require('./models/article');
require('./models/tag');

var articleController = require('./controllers/article');

mongoose.connect(process.env.MONGOLAB_URI ||  'mongodb://localhost/cs110final'); //uses the mongolabs database if it exists; otherwise, a localhost path

app.use(express.json());
app.use(express.urlencoded()); //turns URL data into a usable piece object
// app.use(express.logger()); //logs connection data to node terminal
app.use(express.methodOverride());
app.set('view engine','ejs'); //uses ejs instead of jade
app.use(express.static(__dirname, '/public'));//allows us to use static files from the public directory

//calls functions in the article.js controller file, to do the CRUD things
app.get('/articles',articleController.index);
//app.get('/articles/tags/:tagID',articleController.viewTag);
app.get('/articles/new',articleController.write);
app.get('/articles/:articleID',articleController.view);
app.post('/articles',articleController.create);
app.get('/articles/:articleID/edit',articleController.edit);
app.put('/articles/:articleID',articleController.update);
app.delete('/articles/:articleID',articleController.delete);

app.param('articleID',articleController.load);

app.listen(port,function(err) {
	if (err) throw err;
	console.log('listening on %s',port);
});