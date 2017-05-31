
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
// mongodb server url
var url = 'mongodb://localhost:27017/ownroom';
var database;
app.get('/user/info', function(req, res){
	var collection = database.collection('userinfo');
	collection.find({}).toArray(function(err, docs){
		assert.equal(err, null);
		console.log("Found the following records");
		res.json(docs);
	});
});

app.get('/user/signin', function(req, res){
	var collection = database.collection;
	
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  MongoClient.connect(url, function(err, db){
	  console.log("Connected sucessfully to server");
	  database = db;
  });
});
