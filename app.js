var express = require('express');
var app = express();
var http = require('http').Server(app); 
var io = require('socket.io')(http);    
var path = require('path');

app.set('views', './views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));

var temp = "";

app.get('/main', (req, res) => {  
	temp = "main";
	res.render('main.ejs');
});

app.get('/chat/:room', (req, res) => {  
	temp = "chat";
	res.render('chat.ejs');
	//console.log(req.params.room);
});

var count=1;


var info = {"room1" : [],
			"room2" : [],
			"room3" : [],
			"room4" : [],
			"room5" : []
			};

io.on('connection', function(socket){


	console.log('user connected: ', socket.id);
	socket.emit('refreshMain', info);


	console.log(temp);

	socket.on('disconnect', () => {
		console.log('user disconnected');
		
		for (key in info){
        
			for (i in info[key]){
			  if(info[key][i] == socket.name) info[key].splice(i,1); 
			}

		}
		io.emit('refreshMain', info);
	});
	

	socket.on('changeName', (before, after) => {
		var f = 0;
		var temp;

		for (key in info){
			for (i in info[key]){
				if(info[key][i] == after && after && f == 0) {
					socket.emit('failSetName');

					f = 1;
				}
			}
		}
		if (f == 0){
			for (key in info){
        
				for (i in info[key]){
				  if(info[key][i] == before) {
					temp = key;
					info[key][i] = after; 
					

				  }
				  
				}
	
			}
			socket.name = after; 
			socket.emit('successSetName');
			io.to(temp).emit('noticeChangeName', before, after);
		}
		
		
		
		io.emit('refreshMain', info);

	})

	socket.on('joinRoom', (roomName, name) => {

		
		if(name){
			console.log(info, socket.name)
			for (key in info){
			
				for (i in info[key]){
					if(info[key][i] == socket.name && roomName != key ){
						
						var temp = key;
						var temp2 = i;
						socket.leave(temp)

						io.to(temp).emit('leaveRoom', temp, name);
						info[temp].splice(temp2,1);
						
					}
				}

			}
			
			if (!info[roomName].includes(name) && name != ""){
				//console.log(key, roomName)
				info[roomName].push(name);


				socket.join(roomName, () => {
					socket.emit('joinRoom', roomName, name, 1);
					socket.broadcast.to(roomName).emit('joinRoom', roomName, name, 0);
				});
			}

			
			io.emit('refreshMain', info);
		}

		
	});


	socket.on('sendChat', function(roomName, name, text){

		io.to(roomName).emit('receiveChat', name, text);
	})
	

})










http.listen(3000, function(){ 
	console.log('server on..');
});