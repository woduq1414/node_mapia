var express = require('express');
var app = express();
var http = require('http').Server(app); 
var io = require('socket.io')(http);    
var path = require('path');

app.set('views', './views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/public'));



app.get('/main', (req, res) => {  
	temp = "main";
	res.render('main.ejs');
});

app.get('/chat/:room', (req, res) => {  
	temp = "chat";
	res.render('chat.ejs');
});

var count=1;


// var info = {"r1" : {"members" : []},
// 			"r2" : {"members" : []},
// 			"r3" : {"members" : []},
// 			"r4" : {"members" : []},
// 			"r5" : {"members" : []}
// 			};
var info = {}






io.on('connection', function(socket){

	function newRoomMaster(roomName){
		//socket.broadcast.to(roomName).emit('newRoomMaster', roomName, "aa");
		io.to(roomName).emit('newRoomMaster', roomName, info[roomName].members[0]);
	}

	console.log('user connected: ', socket.id);
	socket.emit('refreshMain', info);

	socket.on('disconnect', () => {
		console.log('user disconnected');
		
		for (key in info){
        
			for (i in info[key]["members"]){
			  if(info[key]["members"][i] == socket.name){
				var temp = key;
				socket.emit('leaveRoom', temp, socket.name, 1);
				socket.broadcast.to(temp).emit('leaveRoom', temp, socket.name, 0);

				if (info[temp].members[0] == socket.name){
						
					newRoomMaster(temp);
				}

				

				info[key]["members"].splice(i,1); 
				if(info[key].members.length == 0){
					console.log(key)
					delete info[key]

				}



			  }
			}

		}
		io.emit('refreshMain', info);
	});


	socket.on('changeName', (before, after) => {
		var f = 0;
		var temp;

		for (key in info){
			for (i in info[key]["members"]){
				if(info[key]["members"][i] == after && after && f == 0) {
					socket.emit('failSetName');

					f = 1;
				}
			}
		}
		if (f == 0){
			for (key in info){
        
				for (i in info[key]["members"]){
				  if(info[key]["members"][i] == before) {
					temp = key;
					info[key]["members"][i] = after; 
					

				  }
				  
				}
	
			}
			socket.name = after; 
			socket.emit('successSetName');
			io.to(temp).emit('noticeChangeName', before, after);
		}
		
		io.emit('refreshMain', info);

	})

	socket.on('changeRoomName', function(before, after){
		info[after] = info[before];
		delete info[before];
		console.log( io.sockets.adapter.rooms[before].sockets, after);
		let beforeList = io.sockets.adapter.rooms[before].sockets;

		for (socketID in beforeList){
			let sock = io.sockets.connected[socketID];
			sock.leave(before)
			sock.join(after)

		}
		io.to(after).emit('changeRoomName', before, after)
	
		io.emit('refreshMain', info);
	})

	socket.on('joinRoom', (roomName, name) => {

		
		if(name){
			console.log(info, socket.name)
			for (key in info){
			
				for (i in info[key]["members"]){
					if(info[key]["members"][i] == socket.name && roomName != key ){
						
						var temp = key;
						var temp2 = i;
						socket.leave(temp)

						io.to(temp).emit('leaveRoom', temp, name);
						

						
						
						if (info[key]["members"].splice(i,1)[0] == socket.name){
							newRoomMaster(temp);
						}

				

						if(info[key].members.length == 0){

							delete info[key]

						}

					}
				}

			}
			
			if (!info[roomName]["members"].includes(name) && name != ""){
				//console.log(key, roomName)
				info[roomName]["members"].push(name);


				socket.join(roomName, () => {
					socket.emit('joinRoom', roomName, name, 1);
					socket.broadcast.to(roomName).emit('joinRoom', roomName, name, 0);
					if (info[roomName].members[0] == name){
						
						newRoomMaster(roomName);
					}
				});
			}
			
			
			
			io.emit('refreshMain', info);
		}


	});


	socket.on('mandateRoomMaster', function(roomName, socketID){
		
		let name = io.sockets.connected[socketID].name;
		for(i in info[roomName].members){
			if(info[roomName].members[i] == name){
				info[roomName].members.splice(i,1);
			}
		}
		info[roomName].members.unshift(name);
		newRoomMaster(roomName)
		io.emit('refreshMain', info);
	})


	socket.on('kick', function(roomName, socketID)
	{
		let sock = io.sockets.connected[socketID]
		let name = sock.name;

		sock.emit('kickedRoom', roomName, name, 1);

		io.to(roomName).emit('kickedRoom', roomName, name, 0);

		sock.leave(roomName);


		for(i in info[roomName].members){
			if(info[roomName].members[i] == name){
				info[roomName].members.splice(i,1);
			}
		}

		io.emit('refreshMain', info);
		
	})

	socket.on('sendChat', function(roomName, name, text){

		io.to(roomName).emit('receiveChat', socket.id, roomName, name, text);
	})
	
	
	socket.on('makeRoom', function(roomName){

		console.log(roomName)
		info[roomName] = {"members" : []} 
		
	})


	socket.on('requestName', function(socketID){
		let sock = io.sockets.connected[socketID];
		socket.emit("getName", sock.name);
	})
})










http.listen(process.env.PORT || 3000, function(){ 
	console.log('server on..');
});