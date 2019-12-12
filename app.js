// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;

// server.js

var express = require('express');
var app = express();
var http = require('http').Server(app); 
var io = require('socket.io')(http);    
var path = require('path');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {  
  res.render('chat');
});

var count=1;
io.on('connection', function(socket){ 
  	console.log('user connected: ', socket.id);  
  	var name = "익명" + count++;                 
	socket.name = name;
  	io.to(socket.id).emit('create name', name);   
	
	socket.on('disconnect', function(){ 
	  console.log('user disconnected: '+ socket.id + ' \n name : ' + socket.name);
	});

	socket.on('send message', function(name, text){ 
		var msg = name + ' : ' + text;
		socket.name = name;
    	console.log(msg);
    	io.emit('receive message', msg);
	});
	
});

http.listen(3000, function(){ 
	console.log('server on..');
});