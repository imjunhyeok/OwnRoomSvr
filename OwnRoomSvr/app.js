
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
	console.log(req.param('usrid'));
	var usrid = req.param('usrid');
	var collection = database.collection('userinfo');
	// 파라미터가 없는 경우 데이터 전체를 넘겨줌
	if( usrid === undefined){
		collection.find({}).toArray(function(err, docs){
			assert.equal(err, null);
			console.log("Found the following records");
			res.json(docs);
		});
	}
	// 파라미터가 있는 경우
	else {
		collection.findOne({"usrid":usrid}, function(err,docs){
			if(err) throw err;
			res.send(docs);
		});
	}
});

app.post('/user/updateUserInfo', function(req, res){
	var usrid = req.param('usrid');
	var usrpwd = req.param('usrpwd');
	var usrname = req.param('usrname');
	var usrregdate = req.param('usrregdate');
	var collection = database.collection('userinfo');
	collection.insert({
		'usrid' : usrid,
		'usrpwd' : usrpwd,
		'usrname' : usrname,
		'usrregdate' : usrregdate
	});
	console.log('Success to insert userinfo data');
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  MongoClient.connect(url, function(err, db){
	  console.log("Connected sucessfully to server");
	  database = db;
  });
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
	socket.emit('toclient', { msg : 'Welcome!'});
	socket.on('fromclient', function(data){
		socket.broadcast.emit('toclient', data);
		console.log('Message from client : ' + data.msg);
	});
});