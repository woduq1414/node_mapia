var express = require('express');
var app = express();
const session = require('express-session'); // 세션 설정
var http = require('http').Server(app); 
var io = require('socket.io')(http);    
var path = require('path');
var connect = require('connect')
var route = require('./views/route');
var bodyParser = require('body-parser');         
var sessionStore = require('sessionstore') ;                                                           
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));






var mongoose = require('mongoose');



const passport = require('passport'); // 여기와
const passportConfig = require('./views/passport'); // 여기
app.use(session({ secret: '비밀코드', resave: true, saveUninitialized: false })); // 세션 활성화
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결
passportConfig(); // 이 부분 추가

const userModel2 = require('./views/user');

app.use('/', route);




app.set('views', './views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/public'));


// var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb+srv://woduq1414:woduq1219!@cluster0-jhl8c.mongodb.net/test?retryWrites=true&w=majority';
// var db;
// var users;
// MongoClient.connect(url, function (err, database) {
//    if (err) {
//       console.error('MongoDB 연결 실패', err);
//       return;
//    }

//    db = database;

//    console.log(database)
// 	users = db.Collection('users');
// });





sessionID = '';
sessionName = '';
sess = {};
app.get('/main', (req, res) => {  
	if(req.user){
		sessionID = req.user.id;
		const MongoClient = require('mongodb').MongoClient;
			const uri = "mongodb+srv://woduq1414:woduq1219!@cluster0-jhl8c.mongodb.net/test?retryWrites=true&w=majority";
			//const uri = "mongodb+srv://woduq1414:woduq1219!@cluster0-jhl8c.mongodb.net/test";
			const client = new MongoClient(uri, { useNewUrlParser: true });
			var user;
			client.connect(err => {
				user = client.db("test").collection("users");
				user.findOne({ id: sessionID }, function (err, result) {
					if (err) {
					console.error('UpdateOne Error ', err);
					return;
					}
					sessionName = result.name;
					console.log("!!!!!!!!!!!!!",sessionName);
					res.render('main.ejs', {name : sessionName});

					
				});
				client.close();
		});
	}else{
		res.redirect("/index");
	}
	
	


	
	
	
});

app.get('/index', (req, res) => {  
	if(req.user){
		//res.redirect("/main");
		res.render('index.ejs');
	}else{
		res.render('index.ejs');
	}
	
});




// app.post('/login', async(req, res) => {
// 	let id = req.body.id
// 	let password = req.body.password
// 	// let result = await userModel.findOne({
// 	// 	where: {
// 	// 	  id : id
// 	// 	}
// 	// });
// 	userModel.findOne({'id':id}, function(err,docs){
		
// 		let dbPassword = docs.password;
// 		if(password == dbPassword){
// 			console.log("yes")
// 			res.redirect("/main");
// 		}else{
// 			console.log("no")
			
// 		}
// 	});
// 	//console.log(result)
	
// })

var count=1;


// var info = {"r1" : {"members" : []},
// 			"r2" : {"members" : []},
// 			"r3" : {"members" : []},
// 			"r4" : {"members" : []},
// 			"r5" : {"members" : []}
// 			};
var info = {}
var users = {}
var timeLimit = {}
var timer = {}


io.on('connection', function(socket){


	function endGame(roomName){
		if(info.hasOwnProperty(roomName)){
			info[roomName].isPlaying = 0;
			refreshMain(info);

			io.to(roomName).emit('endGame');
		}
		
		
	}

	function initGame(roomName){

		console.log("a");
		setDate(roomName, 1,"night");


		
	}


	function setDate(roomName, date, time){

		if(time == "night"){

			io.to(roomName).emit('getGameMembers', info[roomName].members);

			io.to(roomName).emit('getDateStatus', date + "번째 밤")


			timeLimit[roomName] = 20;
			io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
			timer[roomName] = setInterval(function(){
				
				timeLimit[roomName]--;
				io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
				if(timeLimit[roomName] <= 0){
					clearInterval(timer[roomName]);
					endGame(roomName);
				}
			}, 1000)
		}
		
	}



	if(sessionID){
		users[socket.id] = sessionID;

	}
	
	console.log(users);
	io.emit('refreshUser', users);

	function newRoomMaster(roomName, socketID){
		//socket.broadcast.to(roomName).emit('newRoomMaster', roomName, "aa");
		if(!info[roomName].isPlaying){
			io.to(roomName).emit('newRoomMaster', roomName, info[roomName].members[0], socketID);
		}
		
	}

	function refreshMain(info){
		//let temp = info;
		let temp = JSON.parse(JSON.stringify(info));
		
	

		for (roomName in temp){
			if(temp[roomName].password) temp[roomName].password = true
			else temp[roomName].password = false

			// if(temp[roomName].isPlaying){
			// 	delete temp[roomName];
			// }
		}
		io.emit('refreshMain', temp);
	}

	console.log('user connected: ', socket.id);
	
	refreshMain(info);

	socket.on('disconnect', () => {
		console.log('user disconnected');
		
		for (key in info){
		
			for (i in info[key]["members"]){
			  if(info[key]["members"][i] == socket.name){
				var temp = key;
				socket.emit('leaveRoom', temp, socket.name, socket.id, 1);
				socket.broadcast.to(temp).emit('leaveRoom', temp, socket.name, socket.id, 0);

				if (info[temp].members[0] == socket.name){
					refreshMain(info);
					newRoomMaster(temp, socket.id);
				}

				

				info[key]["members"].splice(i,1); 
				if(info[key].members.length == 0){
					delete info[key]
					clearInterval(timer[key]);

				}

				

			  }
			}

		}
		
		delete users[socket.id];
		io.emit('refreshUser', users);
	
		console.log(users);
		refreshMain(info);
	});

	socket.on('initName', function(name){
		socket.name = name;
		console.log("SDFASDF", socket.name)
	})

	socket.on('checkPassword', function(roomName, password){
		if(info[roomName].password == password){
			socket.emit('checkPassword', roomName, true);
		}else{
			socket.emit('checkPassword', roomName, false);
		}

	})


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
			refreshMain(info);

			io.to(temp).emit('noticeChangeName', before, after, socket.id);
			
			//console.log("ASD", before, after ,"sdf");

			// userModel2.findOneAndUpdate({name:before}, { $set:  {name:after} }, function(){
			// 	console.log(after);
			// });
			// userModel2.findOne({'name': before }, function (err, doc) {

			// 	console.log(err, doc);
			// 	doc.name = 'jason bourne';
			// 	doc.save(function (err) {
			// 				if (err) {
			// 					throw err;
			// 				}
			// 				else {
								
			// 				}
			// 	});
			// });
			// userModel2.findOne({'name': before}, function(err, user) {
			// 	if(err) {
			// 		throw err;
			// 	}
			// 	else {
			// 		user.name = after;
					
			// 		user.save(function (err) {
			// 			if (err) {
			// 				throw err;
			// 			}
			// 			else {
			// 				//
			// 				console.log(user[name])
			// 				console.log(user)
			// 			}
			// 		});
					
			// 	}
			// 	console.log("SAD", user)
			// });
			const MongoClient = require('mongodb').MongoClient;
			const uri = "mongodb+srv://woduq1414:woduq1219!@cluster0-jhl8c.mongodb.net/test?retryWrites=true&w=majority";
			//const uri = "mongodb+srv://woduq1414:woduq1219!@cluster0-jhl8c.mongodb.net/test";
			const client = new MongoClient(uri, { useNewUrlParser: true });
			var users;
			client.connect(err => {
				users = client.db("test").collection("users");
				users.updateOne({ name: before }, { $set: { name: after } }, function (err, result) {
					if (err) {
					console.error('UpdateOne Error ', err);
					return;
					}
					//console.log('UpdateOne 성공 ');
				});
				client.close();
			});
			
		}
		
		refreshMain(info);
	})

	socket.on('changeRoomName', function(before, after){
		info[after] = info[before];
		delete info[before];

		let beforeList = io.sockets.adapter.rooms[before].sockets;

		for (socketID in beforeList){
			
			let sock = io.sockets.connected[socketID];
			
			sock.leave(before)
			sock.join(after)

		}
		io.to(after).emit('changeRoomName', before, after)
		console.log(io.sockets.adapter.rooms[after].sockets);
		refreshMain(info);
	})
	

	socket.on('changePassword', function(roomName, password){
		
		
		if(info[roomName].password != password){
			info[roomName].password = password;
			if(password == ""){
				io.to(roomName).emit('changePassword', roomName, 0);
			}else{
				io.to(roomName).emit('changePassword', roomName, 1);
			}
			
		}

		
	
		refreshMain(info);
	})


	socket.on('changeRoomLimit', function(roomName, before, after){
		
		
		if(info[roomName].members.length <= after){
			info[roomName].limit = after;
			io.to(roomName).emit('changeRoomLimit', before, after);
		}else{
			socket.emit('changeRoomLimitErr');
		}

		
	
		refreshMain(info);
	})

	socket.on('joinRoom', (roomName, name) => {

		
		if(name){

			if(info[roomName].limit > info[roomName].members.length){
				console.log(info, socket.name)
				for (key in info){
				
					for (i in info[key]["members"]){
						if(info[key]["members"][i] == socket.name && roomName != key ){
							
							var temp = key;
							var temp2 = i;
							socket.leave(temp)

							io.to(temp).emit('leaveRoom', temp, name, socket.id);
							

							
							
							if (info[key]["members"].splice(i,1)[0] == socket.name){
								refreshMain(info);
								newRoomMaster(temp, socket.id);
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
						socket.emit('joinRoom', roomName, name, socket.id, 1);
						socket.broadcast.to(roomName).emit('joinRoom', roomName, name, socket.id, 0);
						if (info[roomName].members[0] == name){
							refreshMain(info);
							newRoomMaster(roomName, socket.id);
						}
					});
				}
				
				
				// info[roomName]["members"].push("1");
				// info[roomName]["members"].push("2");
				// info[roomName]["members"].push("3");
				// info[roomName]["members"].push("4");

				refreshMain(info);
			}else{
				
				socket.emit('exceedRoomLimit', roomName);
			}

			
		}


	});


	socket.on('leaveRoom', function(roomName){
		console.log("leaveroom!!", roomName);

		for (i in info[roomName]["members"]){
			if(info[roomName]["members"][i] == socket.name){

				socket.leave(roomName)
				
				io.to(roomName).emit('leaveRoom', roomName, socket.name, socket.id, 0);
				socket.emit('leaveRoom', roomName, socket.name, socket.id, 1);
				

				
				
				if (info[roomName]["members"].splice(i,1)[0] && i == 0){
					console.log("SDFSADFSDAFSADF", socket.name)
					newRoomMaster(roomName, socket.id);
				}

		

				if(info[roomName].members.length == 0){

					delete info[roomName]
					clearInterval(timer[roomName]);
				}
				refreshMain(info);
			}
		}




	})


	socket.on('mandateRoomMaster', function(roomName, socketID){
		
		let sock = io.sockets.connected[socketID]
		let name = sock.name;
		for(i in info[roomName].members){
			if(info[roomName].members[i] == name){
				info[roomName].members.splice(i,1);
				info[roomName].members.unshift(name);
				refreshMain(info);
				newRoomMaster(roomName, socketID)
				break;
			}
		}
		
		
		
	})


	socket.on('kick', function(roomName, socketID)
	{
		let sock = io.sockets.connected[socketID]
		console.log(socketID);
		let name = sock.name;

		

		for(i in info[roomName].members){
			if(info[roomName].members[i] == name){
				sock.emit('kickedRoom', roomName, name, sock.id, 1);
				io.to(roomName).emit('kickedRoom', roomName, name, sock.id, 0);
				sock.leave(roomName);
				info[roomName].members.splice(i,1);
			}
		}
		if(info[roomName].members.length == 0){
			delete info[roomName]

		}
		refreshMain(info);
		
	})

	socket.on('sendChat', function(roomName, socketID, text){
		let sock = io.sockets.connected[socketID]
		let name = sock.name;
		io.to(roomName).emit('receiveChat', socket.id, roomName, name, text);
	})
	
	
	socket.on('makeRoom', function(roomName, password, roomLimit){


		if(!info.hasOwnProperty(roomName)){
			info[roomName] = {"members" : [], "password" : password, "limit" : roomLimit, "isPlaying" : 0} 
		}
	})


	socket.on('requestName', function(socketID){
		let sock = io.sockets.connected[socketID];
		socket.emit("getName", sock.name);
	})



	socket.on('startGame', function(roomName){
		info[roomName].isPlaying = 1;
		refreshMain(info);

		io.to(roomName).emit('startGame');

		initGame(roomName);

		
		
	})


	socket.on('endGame', function(roomName){
		endgame(roomName);
	})



})











http.listen(process.env.PORT || 3000, function(){ 
	console.log('server on..');
});