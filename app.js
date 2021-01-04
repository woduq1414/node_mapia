const NIGHT_TIME = 15;
const DAY_TIME = 30;
const VOTE_TIME = 10;
const APPEAL_TIME = 10;
const FINAL_TIME = 10;
const RESULT_TIME = 5;

const CHECK_END = 1;
const PASS_LOGIN = 1;
const GAME_TYPE = "normal";

let mafiaTeam = ["mafia", "spy"]

// nodemon --ignore 'game.js' 'main.js'
require('dotenv').config();
const config = {
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD
}



var express = require('express');
var app = express();
const session = require('express-session'); // 세션 설정
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var connect = require('connect')
var route = require('./views/route');
var bodyParser = require('body-parser');
var sessionStore = require('sessionstore');
var xss = require("xss");

var async = require('async')


const reload = require('reload')



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));






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



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@cluster0-jhl8c.mongodb.net/test?retryWrites=true&w=majority`;

function connectDB() {
	//localhost 로컬 호스트
	//:27017  몽고디비 포트
	//local db 생성시 만든 폴더 명
	var databaseURL = uri;
	MongoClient.connect(databaseURL,
		function (err, database) {
			if (err) {
				console.log('db connect error');
				return;
			}

			console.log('db was connected : ' + databaseURL);
			db = database;          //이 구문까지 실행되었다면 ongoDB 에 연결된 것
		}
	);

}



// var async = require('async');
var async = require('async');
console.log("start");
data = ""


async.waterfall([
	function (callback) {
		setTimeout(function () {
			console.log('func_1 function is called');
			callback(null, 'first');
		}, 2000);


		// 출처: https://hanswsw.tistory.com/2 [Han's Dev Log]

	}, // 1 
	function (arg, callback) {
		console.log("arg : " + arg);
		callback(null, 'second');
	}, // 2 
	function (arg, callback) {
		console.log("arg : " + arg);
		callback(null, 'finish');
	}  // 3 
], function (err, result) {
	if (err) {
		console.log('Error 발생');
	} else {
		console.log('result : ' + result);
	}  // 4
	data = "helllo";
});
console.log(data);

// 출처: https://hanswsw.tistory.com/2 [Han's Dev Log]

console.log("end");

// const client = new MongoClient(uri, { useNewUrlParser: true });




// var MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@cluster0-jhl8c.mongodb.net/test?retryWrites=true&w=majority`;
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

function randomString(len) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

	var string_length = len;
	var randomstring = '';
	for (var i = 0; i < string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	//document.randform.randomfield.value = randomstring;
	return randomstring;
}


function getHash(text, max) {
	var hash = 0, len = text.length;
	if (text.length === 0) {
		return hash;
	}
	for (i = 0; i < len; i++) {
		charC = text.charCodeAt(i);
		hash = ((hash << 2) - hash) + charC;
		hash = hash & hash;
	}

	hash = hash * hash



	hash = (hash % max) + 1;
	return hash;
}


function getLevel(exp) {
	console.log(exp)
	return Math.floor(exp / 500) + 1
}

function getNeedExp(level) {
	//console.log(exp)
	return level * 500
}




app.get('/main', (req, res) => {

	if (req.user) {
		sessionID = req.user.id;

		var user;

		user = client.db("test").collection("users");
		user.findOne({ id: sessionID }, function (err, result) {
			if (err) {
				console.error('UpdateOne Error ', err);
				return;
			}
			sessionName = result.name;
			console.log(`${sessionName} 로그인`);
			res.render('main.ejs', { name: sessionName });


		});
		client.close();

	} else if (PASS_LOGIN) {
		res.render('main.ejs', { name: randomString(4) });
	} else {
		res.redirect("/index");
	}







});

app.get('/beta', (req, res) => {

	if (req.user) {
		sessionID = req.user.id;
		// const MongoClient = require('mongodb').MongoClient;
		// const uri = `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@cluster0-jhl8c.mongodb.net/test?retryWrites=true&w=majority`;

		// const client = new MongoClient(uri, { useNewUrlParser: true });
		var user;
		// client.connect(err => {
		// 	user = client.db("test").collection("users");
		// 	user.findOne({ id: sessionID }, function (err, result) {
		// 		if (err) {
		// 			console.error('UpdateOne Error ', err);
		// 			return;
		// 		}
		// 		sessionName = result.name;
		// 		sessionLevel = result.stat.level
		// 		console.log(`${sessionName} 로그인`);
		// 		res.render('beta.ejs', { name: sessionName, level : sessionLevel });


		// 	});
		// 	client.close();
		// });

		db.db('test').collection("users").findOne({ id: sessionID }, function (err, result) {
			if (err) {
				console.error('UpdateOne Error ', err);
				return;
			}
			sessionName = result.name;
			sessionExp = result.stat.exp
			console.log(sessionExp)
			console.log(`${sessionName} 로그인`);
			level = getLevel(sessionExp);
			res.render('beta.ejs', { name: sessionName, level: level, exp: sessionExp - getNeedExp(level - 1) });


		});

	} else if (PASS_LOGIN) {
		let name = randomString(4);

		res.render('beta.ejs', { name: name, level: 20, exp: 350 });
	} else {
		res.redirect("/index");
	}


});





app.get('/index', (req, res) => {
	if (req.user) {
		//res.redirect("/main");
		res.render('index.ejs');
	} else {
		res.render('index.ejs');
	}

});


app.post('/api/users', (req, res) => {
	if (req.body.userName) {
		userName = req.body.userName
		var user;
		user = db.db('test').collection("users");

		user.findOne({ name: userName }, function (err, result) {
			if (err) {
				res.send("err")
			}
			res.send(result.stat);
		});

	} else {
		res.send("erra");
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

var count = 1;


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


io.on('connection', function (socket) {


	function endGame(roomName, winner) {
		io.to(roomName).emit('selectPlayerUnavailable', "");
		if (info.hasOwnProperty(roomName)) {

			clearInterval(timer[roomName]);

			let jobs = {}
			for (member of info[roomName].members) {
				jobs[member] = getOriginalJobName(roomName, member);
			}

			io.to(roomName).emit('noticeGameResult', winner, RESULT_TIME, jobs);

			let inc = {}


			if (!PASS_LOGIN) {
				if (winner = "citizenWin") { //시민 승


					for (i in info[roomName].members) {
						let member = info[roomName].members[i];
						if (mafiaTeam.includes(getJobName(roomName, member))) {
							var user;

							user = db.db('test').collection("users");
							inc = {
								"stat.gameCount": 1,
								"stat.mafiaLose": 1,
								"stat.exp": 100
							}



						} else {
							var user;

							user = db.db('test').collection("users");
							inc = {
								"stat.gameCount": 1,
								"stat.citizenWin": 1,
								"stat.exp": 200

							}



						}
					}

				} else if (winner = "mafiaWin") { // 마피아 승

					for (i in info[roomName].members) {
						let member = info[roomName].members[i];
						if (mafiaTeam.includes(getJobName(roomName, member))) {
							var user;

							user = db.db('test').collection("users");
							inc = {
								"stat.gameCount": 1,
								"stat.mafiaWin": 1,
								"stat.exp": 200
							}



						} else {
							var user;

							user = db.db('test').collection("users");
							inc = {
								"stat.gameCount": 1,
								"stat.citizenLose": 1,
								"stat.exp": 100
							}



						}
					}

				}
				async.parallel([
					function (callback) {
						async.forEach(info[roomName].members, function (member, userCallback) {
							var user;
							user = db.db('test').collection("users");
							user.updateOne({ name: member }, {
								$inc: inc
							}, function (err, result) {
								user.findOne({ name: member }, function (err, result) {

									let socketID = info[roomName].gameState.job[member].socketID
									let sock = io.sockets.connected[socketID];
									let level = getLevel(result.stat.exp)
									console.log(level)
									sock.emit('refreshLevel', level, result.stat.exp - getNeedExp(level - 1));
								});

								userCallback()
							})
						}, function () {
							callback(null)

						})
					}

				], function (err) {
					let socketList = io.sockets.adapter.rooms[roomName].sockets;
					let data = {};

					async.parallel([
						function (callback) {
							async.forEach(Object.keys(socketList), function (socketID, userCallback) {
								console.log(socketID, "!!!!!")
								let sock = io.sockets.connected[socketID];
								data[sock.name] = { "socketID": "" };
								data[sock.name].socketID = socketID;
								//let level = getHash(sock.name, 150);

								var user;

								user = db.db('test').collection("users");



								async.waterfall([
									function (callback) {
										user.findOne({ name: sock.name }, function (err, result) {
											callback(null, result);
										})
									}
								], function (err, result) {
									if (err) {
										console.log('Error 발생');
									} else {


										let mafiaRate = result.stat.mafiaWin / (result.stat.mafiaWin + result.stat.mafiaLose + 1)
										let citizenRate = result.stat.citizenWin / (result.stat.citizenWin + result.stat.citizenLose + 1)

										if (mafiaRate >= citizenRate) {
											data[sock.name].levelType = "Mafia";
										} else {
											data[sock.name].levelType = "Citizen";
										}


										data[sock.name].level = getLevel(result.stat.exp)
									}  // 4

									userCallback();
								});




							}, function () {
								callback(null);
							})

						}
					], function (err) {
						console.log("@@@@@@@@@@@@@@@@22");
						console.log(data)
						io.to(roomName).emit('refreshRoom', data);

					});
				})
			}












			timeLimit[roomName] = RESULT_TIME;
			io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
			timer[roomName] = setInterval(function () {

				timeLimit[roomName]--;
				io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
				if (timeLimit[roomName] <= 0) {
					clearInterval(timer[roomName]);
					info[roomName].isPlaying = 0;
					refreshMain(info);

					io.to(roomName).emit('endGame');

				}
			}, 1000)
		}


	}
	function moveRoom(before, after, isLeave) {
		let beforeList = io.sockets.adapter.rooms[before].sockets;

		for (socketID in beforeList) {

			let sock = io.sockets.connected[socketID];
			if (isLeave) sock.leave(before)
			sock.join(after)

		}
	}

	function initGame(roomName) {

		Object.size = function (obj) {
			var size = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		};

		function shuffle(a) { var j, x, i; for (i = a.length; i; i -= 1) { j = Math.floor(Math.random() * i); x = a[i - 1]; a[i - 1] = a[j]; a[j] = x; } }






		let roomMember = io.sockets.adapter.rooms[roomName].sockets;

		let jobList = new Array();


		if (info[roomName].type == "normal") {
			let maxMember = Object.size(roomMember);
			function addJob(jobName, n) {
				for (let i = 0; i < n; i++) {
					jobList.push(jobName)
				}
				return n;
			}
			maxMember -= addJob("mafia", Math.floor(maxMember / 4));
			if (maxMember >= 5) {
				maxMember -= addJob("spy", 1);
			}
			maxMember -= addJob("police", 1);
			maxMember -= addJob("doctor", 1);

			let specialJob = ["soldier", "politician", "shaman", "reporter", "detective", "priest"];
			let temp = specialJob;
			for (let i = 0; i < maxMember; i++) {
				//jobList[i] = "citizen";
				if (temp.length > 0) {
					shuffle(temp);
					jobList.push(temp.pop())
				} else {
					jobList.push("citizen")
				}



			}
			shuffle(jobList);

		} else {
			for (let i = 0; i < Object.size(roomMember); i++) {
				//jobList[i] = "citizen";
				jobList.push("citizen")
			}

			//custom_job

			jobList[0] = "mafia"
			jobList[1] = "doctor"
			jobList[2] = "soldier";

			customJobArray = info[roomName].gameState.jobArray;
			for (let i in customJobArray) {
				jobList[i] = customJobArray[i]
			}
		}










		let i = 0;


		let aliveRoomName = randomString(10);

		info[roomName].roomKey["alive"] = aliveRoomName;

		moveRoom(roomName, aliveRoomName, 0);



		let mafiaRoomName = randomString(10);
		info[roomName].roomKey["mafia"] = mafiaRoomName;

		let deadRoomName = randomString(10);

		info[roomName].roomKey["dead"] = deadRoomName;



		for (socketID in roomMember) {
			//console.log(memberID);
			let sock = io.sockets.connected[socketID];
			info[roomName].gameState.job[sock.name] = { "socketID": sock.id, "jobName": jobList[i], "selected": "", "ability": 1, "originalJobName": jobList[i], "contacted": 0 };

			if (jobList[i] == "mafia") {
				sock.join(mafiaRoomName)
			}
			if (jobList[i] == "shaman") {
				sock.join(deadRoomName)
			}



			sock.emit('initJob', jobList[i]);
			i++;
		}










		setDate(roomName, 1, "night");



	}

	function getJobOwner(roomName, jobName) {
		let temp = [];
		for (memberName in info[roomName].gameState.job) {
			if (info[roomName].gameState.job[memberName].jobName == jobName) {
				temp.push(memberName);
			}
		}
		return temp;
	}

	function getSelected(roomName, memberName) {
		if (getAliveMember(roomName).includes(memberName)) {
			return info[roomName].gameState.job[memberName].selected;
		} else {
			return "";
		}

	}

	function getIsContacted(roomName, memberName) {
		return info[roomName].gameState.job[memberName].contacted;

	}

	function getJobName(roomName, memberName) {
		return info[roomName].gameState.job[memberName].jobName;
	}

	function getOriginalJobName(roomName, memberName) {
		return info[roomName].gameState.job[memberName].originalJobName;
	}

	function hasAbility(roomName, memberName) {
		return info[roomName].gameState.job[memberName].ability;
	}


	function getAliveMember(roomName) {
		let temp = [];
		for (memberName in info[roomName].gameState.job) {
			if (info[roomName].gameState.job[memberName].jobName != "dead") {
				temp.push(memberName);
			}
		}
		return temp;
	}

	function getDeadMember(roomName) {
		let temp = [];
		for (memberName in info[roomName].gameState.job) {
			if (info[roomName].gameState.job[memberName].jobName == "dead") {
				temp.push(memberName);
			}
		}
		return temp;
	}

	function actionNight(roomName) {
		let mafiaName = getJobOwner(roomName, "mafia")[0];
		let doctorName = getJobOwner(roomName, "doctor")[0];
		let soldierName = getJobOwner(roomName, "soldier")[0];
		let reporterName = getJobOwner(roomName, "reporter")[0];
		let reporterSelected = getSelected(roomName, reporterName);
		let priestName = getJobOwner(roomName, "priest")[0];
		let priestSelected = getSelected(roomName, priestName);
		if (mafiaName) {
			let mafiaSelected = getSelected(roomName, mafiaName);
			let doctorSelected = getSelected(roomName, doctorName);
			console.log("!!!!!!!!!", mafiaName, doctorName);
			console.log("@@", mafiaSelected, doctorSelected);
			if (mafiaSelected) {

				if (doctorSelected == mafiaSelected) {
					io.to(roomName).emit('doctorAbility', mafiaSelected);
				} else if (mafiaSelected == soldierName && hasAbility(roomName, soldierName)) {
					io.to(roomName).emit('soldierAbility', mafiaSelected);
					info[roomName].gameState.job[soldierName].ability = 0;
				} else {
					io.to(roomName).emit('mafiaAbility', mafiaSelected);

					info[roomName].gameState.job[mafiaSelected].jobName = "dead";
					socketID = info[roomName].gameState.job[mafiaSelected].socketID;
					let sock = io.sockets.connected[socketID];
					sock.join(info[roomName].roomKey.dead);
					sock.join(info[roomName].roomKey.mafia);
				}


			}
		}
		if (reporterSelected && getJobName(roomName, reporterName) != "dead") {
			io.to(roomName).emit('reporterAbility', reporterSelected, getOriginalJobName(roomName, reporterSelected));
			info[roomName].gameState.job[reporterName].ability = 0;
		}
		if (priestSelected && getDeadMember(roomName).length > 0 && getJobName(roomName, priestName) != "dead") {

			let socketID = info[roomName].gameState.job[priestSelected].socketID;
			let sock = io.sockets.connected[socketID];
			sock.join(info[roomName].roomKey.dead);
			sock.join(info[roomName].roomKey.mafia);
			info[roomName].gameState.job[priestSelected].jobName = info[roomName].gameState.job[priestSelected].originalJobName;
			info[roomName].gameState.job[priestName].ability = 0;
			io.to(roomName).emit('priestAbility', priestSelected);
			refreshRoom(roomName);
		}






	}

	function isGameEnd(roomName) {
		let aliveMember = getAliveMember(roomName);
		let citizenCount = 0;
		let mafiaCount = 0;
		for (i in aliveMember) {
			if (getJobName(roomName, aliveMember[i]) == "mafia" ||
				(mafiaTeam.includes(getJobName(roomName, aliveMember[i])) && getIsContacted(roomName, aliveMember[i]))) {
				mafiaCount += 1;
			} else {
				citizenCount += 1;
			}
		}
		if (CHECK_END) {
			if (mafiaCount == 0) { //시민 승




				return "citizenWin"
			} else if (mafiaCount >= citizenCount) { // 마피아 승


				return "mafiaWin"
			} else {
				return "";
			}
		}

	}


	function setDate(roomName, date, time) {






		info[roomName].gameState.date = date;

		refreshRoom(roomName);
		io.to(roomName).emit('selectPlayerUnavailable', "");
		if (time == "night") {





			info[roomName].gameState.time = "night"



			io.to(roomName).emit('getDateStatus', date, "밤")


			let roomMember = io.sockets.adapter.rooms[roomName].sockets;

			for (socketID in roomMember) {
				let sock = io.sockets.connected[socketID];
				info[roomName].gameState.job[sock.name].selected = "";
				if (info[roomName].gameState.job[sock.name].jobName == "mafia") {
					info[roomName].gameState.job[sock.name].ability = 1;
					sock.emit('selectPlayerAvailable', "죽일 사람을 지목해주세요.", getAliveMember(roomName))
				} else if (info[roomName].gameState.job[sock.name].jobName == "doctor") {
					info[roomName].gameState.job[sock.name].ability = 1;
					sock.emit('selectPlayerAvailable', "살릴 사람을 지목해주세요.", getAliveMember(roomName))
				} else if (info[roomName].gameState.job[sock.name].jobName == "police") {
					info[roomName].gameState.job[sock.name].ability = 1;
					sock.emit('selectPlayerAvailable', "조사할 사람을 지목해주세요.", getAliveMember(roomName))
				} else if (info[roomName].gameState.job[sock.name].jobName == "shaman") {
					info[roomName].gameState.job[sock.name].ability = 1;
					sock.emit('selectPlayerAvailable', "죽은 사람 중 직업을 알아낼 사람을 지목해주세요.", getDeadMember(roomName))
				} else if (info[roomName].gameState.job[sock.name].jobName == "reporter" && date >= 2 && hasAbility(roomName, sock.name)) {
					sock.emit('selectPlayerAvailable', "특종을 취재할 대상을 지목해주세요.", getAliveMember(roomName))
				} else if (info[roomName].gameState.job[sock.name].jobName == "detective") {
					info[roomName].gameState.job[sock.name].ability = 1;
					sock.emit('selectPlayerAvailable', "조사할 사람을 지목해주세요.", getAliveMember(roomName))
				} else if (info[roomName].gameState.job[sock.name].jobName == "priest" && getDeadMember(roomName).length > 0 && hasAbility(roomName, sock.name)) {
					sock.emit('selectPlayerAvailable', "살릴 사람을 지목해주세요.", getDeadMember(roomName))
				} else if (info[roomName].gameState.job[sock.name].jobName == "spy") {
					info[roomName].gameState.job[sock.name].ability = 1;
					sock.emit('selectPlayerAvailable', "조사할 사람을 지목해주세요.", getAliveMember(roomName))
				}
			}




			timeLimit[roomName] = NIGHT_TIME;
			io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
			timer[roomName] = setInterval(function () {

				timeLimit[roomName]--;
				io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
				if (timeLimit[roomName] <= 0) {
					clearInterval(timer[roomName]);


					actionNight(roomName);

					let winner = isGameEnd(roomName);
					if (winner) {
						endGame(roomName, winner);
					} else {
						setDate(roomName, date, "day")
					}





					//endGame(roomName);
				}
			}, 1000)

			if (date == 3) {
				endGame(roomName);
			}



		} else if (time == "day") {


			info[roomName].gameState.time = "day"



			io.to(roomName).emit('getDateStatus', date, "낮")
			io.to(roomName).emit('selectPlayerUnavailable', "");






			timeLimit[roomName] = DAY_TIME;
			io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
			timer[roomName] = setInterval(function () {

				timeLimit[roomName]--;
				io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
				if (timeLimit[roomName] <= 0) {
					clearInterval(timer[roomName]);
					setDate(roomName, date, "vote")


				}
			}, 1000)
		} else if (time == "vote") {

			info[roomName].gameState.time = "vote"

			io.to(roomName).emit('gameMessage', "투표시간이 되었습니다.")

			let roomMember = io.sockets.adapter.rooms[roomName].sockets;

			for (socketID in roomMember) {
				let sock = io.sockets.connected[socketID];
				info[roomName].gameState.job[sock.name].selected = "";
				if (info[roomName].gameState.job[sock.name].jobName != "dead") {
					sock.emit('selectPlayerAvailable', "마피아로 의심되는 사람을 지목해주세요.", getAliveMember(roomName))
				}
			}





			timeLimit[roomName] = VOTE_TIME;
			io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
			timer[roomName] = setInterval(function () {

				timeLimit[roomName]--;
				io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
				if (timeLimit[roomName] <= 0) {
					clearInterval(timer[roomName]);
					setDate(roomName, date, "appeal")






				}
			}, 1000)
		} else if (time == "appeal") {



			let voted = {};
			for (member in info[roomName].gameState.job) {
				if (voted.hasOwnProperty(getSelected(roomName, member))) {
					if (getJobName(roomName, member) == "politician") {
						voted[getSelected(roomName, member)] += 2;
					} else {
						voted[getSelected(roomName, member)] += 1;
					}

				} else {
					if (getJobName(roomName, member) == "politician") {
						voted[getSelected(roomName, member)] = 2;
					} else {
						voted[getSelected(roomName, member)] = 1;
					}
				}
			}
			console.log(voted);


			let max = 0;
			let maxMember = [];
			for (member in voted) {
				if (member) {
					if (max < voted[member]) {
						max = voted[member];
					}

				}
			}
			for (member in voted) {
				if (member) {
					if (max == voted[member]) {
						maxMember.push(member);
					}

				}
			}

			if (maxMember.length == 1) {
				let execution = maxMember[0];

				info[roomName].gameState.time = "appeal"
				info[roomName].gameState.appeal = execution;
				io.to(roomName).emit('gameMessage', "최후의 변론 시간입니다.")
				io.to(roomName).emit('appeal', execution);


				timeLimit[roomName] = APPEAL_TIME;
				io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
				timer[roomName] = setInterval(function () {

					timeLimit[roomName]--;
					io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
					if (timeLimit[roomName] <= 0) {
						clearInterval(timer[roomName]);



						setDate(roomName, date, "final")







					}
				}, 1000)
			} else {

				let winner = isGameEnd(roomName);
				if (winner) {
					endGame(roomName, winner);
				} else {
					setDate(roomName, date + 1, "night")
				}


			}







		} else if (time == "final") {
			info[roomName].gameState.time = "final"

			let execution = info[roomName].gameState.appeal;

			let roomMember = io.sockets.adapter.rooms[roomName].sockets;

			for (socketID in roomMember) {
				let sock = io.sockets.connected[socketID];
				info[roomName].gameState.job[sock.name].selected = "";
			}

			io.to(info[roomName].roomKey.alive).emit('finalVote', execution);




			timeLimit[roomName] = FINAL_TIME;
			io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
			timer[roomName] = setInterval(function () {

				timeLimit[roomName]--;
				io.to(roomName).emit('getTimeStatus', timeLimit[roomName]);
				if (timeLimit[roomName] <= 0) {
					clearInterval(timer[roomName]);

					io.to(info[roomName].roomKey.alive).emit('endFinalVote');

					let agree = 0;
					let disagree = 0;

					for (member in info[roomName].gameState.job) {
						if (getJobName(roomName, member) != "dead") {
							if (getSelected(roomName, member) == 1) {
								if (getJobName(roomName, member) == "politician") {
									agree += 2;
								} else {
									agree += 1;
								}
							} else {
								if (getJobName(roomName, member) == "politician") {
									disagree += 2;
								} else {
									disagree += 1;
								}
							}
						}

					}
					console.log(agree, disagree);

					if (agree >= disagree) {
						if (getJobName(roomName, member) == "politician") {
							io.to(roomName).emit('politicianAbility', execution);
							io.to(roomName).emit('voteResult', execution, 0);
						} else {
							io.to(roomName).emit('voteResult', execution, 1);

							info[roomName].gameState.job[execution].jobName = "dead";
							socketID = info[roomName].gameState.job[execution].socketID;
							let sock = io.sockets.connected[socketID];
							sock.join(info[roomName].roomKey.dead);
							sock.join(info[roomName].roomKey.mafia);
						}

					} else {
						io.to(roomName).emit('voteResult', execution, 0);
					}



					let winner = isGameEnd(roomName);
					if (winner) {
						endGame(roomName, winner);
					} else {
						setDate(roomName, date + 1, "night")
					}









				}
			}, 1000)



		}

	}



	if (sessionID) {
		users[socket.id] = sessionID;

	}

	console.log(users);
	io.emit('refreshUser', users);

	function newRoomMaster(roomName, socketID) {
		//socket.broadcast.to(roomName).emit('newRoomMaster', roomName, "aa");
		if (!info[roomName].isPlaying) {
			io.to(roomName).emit('newRoomMaster', roomName, info[roomName].members[0], socketID);
		}

	}

	function refreshMain(info) {
		//let temp = info;
		let temp = JSON.parse(JSON.stringify(info));



		for (roomName in temp) {
			if (temp[roomName].password) temp[roomName].password = true
			else temp[roomName].password = false

			delete temp[roomName].job
			// if(temp[roomName].isPlaying){
			// 	delete temp[roomName];
			// }
		}

		io.emit('refreshMain', temp);
	}


	function refreshRoom(roomName) {
		let temp = {};
		temp.members = info[roomName].members;
		temp.alive = getAliveMember(roomName);
		io.to(roomName).emit('refreshGame', temp);
	}




	console.log('user connected: ', socket.id);

	refreshMain(info);

	socket.on('disconnect', () => {
		console.log('user disconnected');

		for (key in info) {

			for (i in info[key]["members"]) {
				if (info[key]["members"][i] == socket.name) {
					var temp = key;
					socket.emit('leaveRoom', temp, socket.name, socket.id, 1);
					socket.broadcast.to(temp).emit('leaveRoom', temp, socket.name, socket.id, 0);

					if (info[temp].members[0] == socket.name) {
						refreshMain(info);
						newRoomMaster(temp, socket.id);
					}



					info[key]["members"].splice(i, 1);


					refreshRoom(temp);


					if (info[key].members.length == 0) {
						delete info[key]
						clearInterval(timer[key]);

					}




				}
			}

		}

		delete users[socket.id];
		io.emit('refreshUser', users);

		//console.log(users);
		refreshMain(info);
	});

	socket.on('initName', function (name) {
		socket.name = name;
		//console.log("SDFASDF", socket.name)
	})

	socket.on('checkPassword', function (roomName, password) {
		if (info[roomName].password == password) {
			socket.emit('checkPassword', roomName, true);
		} else {
			socket.emit('checkPassword', roomName, false);
		}

	})


	socket.on('changeName', (after) => {
		var f = 0;
		var temp;
		let before = socket.name;

		let nameReg = /^[a-zA-Z가-힣]([a-zA-Z0-9가-힣]){1,9}$/
		if (after.match(nameReg) == null) {
			socket.emit('failSetName');
			console.log(after)
			return;
		}

		var users;
		users = db.db("test").collection("users");
		users.findOne({ name: after }, function (err, result) {
			if (result) {
				console.error('UpdateOne Error ', err);
				socket.emit('failSetName');
				f = 1;
			}
			if (PASS_LOGIN){
				f = 0;
			}


			if (f == 0) {
				for (key in info) {

					for (i in info[key]["members"]) {
						if (info[key]["members"][i] == before) {
							temp = key;
							info[key]["members"][i] = after;


						}

					}

				}
				socket.name = after;
				socket.emit('successSetName', after);
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
				// const MongoClient = require('mongodb').MongoClient;
				// const uri = `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@cluster0-jhl8c.mongodb.net/test?retryWrites=true&w=majority`;

				// const client = new MongoClient(uri, { useNewUrlParser: true });
				
				
				if(!PASS_LOGIN){
					var users;
					users = db.db("test").collection("users");
					users.updateOne({ name: before }, { $set: { name: after } }, function (err, result) {
						if (err) {
							console.error('UpdateOne Error ', err);
							return;
						}
						//console.log('UpdateOne 성공 ');
					});
				}

				

			}

			refreshMain(info);
		});



	})

	socket.on('changeRoomName', function (before, after) {
		after = xss(after)
		info[after] = info[before];
		delete info[before];

		let beforeList = io.sockets.adapter.rooms[before].sockets;

		for (socketID in beforeList) {

			let sock = io.sockets.connected[socketID];

			sock.leave(before)
			sock.join(after)

		}
		io.to(after).emit('changeRoomName', before, after)
		//console.log(io.sockets.adapter.rooms[after].sockets);

	})


	socket.on('changePassword', function (roomName, password) {


		if (info[roomName].password != password) {
			info[roomName].password = password;
			if (password == "") {
				io.to(roomName).emit('changePassword', roomName, 0);
			} else {
				io.to(roomName).emit('changePassword', roomName, 1);
			}


		}



	})


	socket.on('changeRoomLimit', function (roomName, before, after) {


		if (info[roomName].members.length <= after) {
			info[roomName].limit = after;
			io.to(roomName).emit('changeRoomLimit', before, after);

		} else {
			socket.emit('changeRoomLimitErr');
		}




	})

	socket.on('requestRefreshMain', function () {
		refreshMain(info);
	})


	socket.on('joinRoom', (roomName) => {

		let name = socket.name;
		if (name) {

			if (info[roomName].limit > info[roomName].members.length) {
				//console.log(info, socket.name)
				for (key in info) {

					for (i in info[key]["members"]) {
						if (info[key]["members"][i] == socket.name && roomName != key) {

							var temp = key;
							var temp2 = i;
							socket.leave(temp)

							io.to(temp).emit('leaveRoom', temp, name, socket.id);




							if (info[key]["members"].splice(i, 1)[0] == socket.name) {
								refreshMain(info);
								newRoomMaster(temp, socket.id);
							}



							if (info[key].members.length == 0) {

								delete info[key]

							}

						}
					}

				}

				if (!info[roomName]["members"].includes(name) && name != "") {
					//console.log(key, roomName)
					info[roomName]["members"].push(name);


					socket.join(roomName, () => {


						let socketList = io.sockets.adapter.rooms[roomName].sockets;
						let data = {};

						async.parallel([
							function (callback) {
								async.forEach(Object.keys(socketList), function (socketID, userCallback) {
									console.log(socketID, "!!!!!")
									let sock = io.sockets.connected[socketID];
									data[sock.name] = { "socketID": "" };
									data[sock.name].socketID = socketID;
									//let level = getHash(sock.name, 150);

									var user;

									user = db.db('test').collection("users");



									async.waterfall([
										function (callback) {
											user.findOne({ name: sock.name }, function (err, result) {
												callback(null, result);
											})
										}
									], function (err, result) {
										if (err) {
											console.log('Error 발생');
										} else {

											if (PASS_LOGIN) {
												data[sock.name].levelType = "Citizen";
												data[sock.name].level = 20;
											} else {
												let mafiaRate = result.stat.mafiaWin / (result.stat.mafiaWin + result.stat.mafiaLose + 1)
												let citizenRate = result.stat.citizenWin / (result.stat.citizenWin + result.stat.citizenLose + 1)

												if (mafiaRate >= citizenRate) {
													data[sock.name].levelType = "Mafia";
												} else {
													data[sock.name].levelType = "Citizen";
												}


												data[sock.name].level = getLevel(result.stat.exp)
											}



										}  // 4

										userCallback();
									});




								}, function () {
									callback(null);
								})

							}
						], function (err) {
							console.log("@@@@@@@@@@@@@@@@22");
							console.log(data)
							socket.emit('joinRoom', roomName, name, socket.id, 1, data);
							socket.broadcast.to(roomName).emit('joinRoom', roomName, name, socket.id, 0, data);
							if (info[roomName].members[0] == name) {
								refreshMain(info);
								newRoomMaster(roomName, socket.id);
							}
						});





					});
				}


				// info[roomName]["members"].push("1");
				// info[roomName]["members"].push("2");
				// info[roomName]["members"].push("3");
				// info[roomName]["members"].push("4");

				refreshMain(info);
			} else {

				socket.emit('exceedRoomLimit', roomName);
			}


		}


	});


	socket.on('leaveRoom', function (roomName) {
		//console.log("leaveroom!!", roomName);

		for (i in info[roomName]["members"]) {
			if (info[roomName]["members"][i] == socket.name) {

				socket.leave(roomName)

				io.to(roomName).emit('leaveRoom', roomName, socket.name, socket.id, 0);
				socket.emit('leaveRoom', roomName, socket.name, socket.id, 1);

				refreshRoom(roomName);


				if (info[roomName]["members"].splice(i, 1)[0] && i == 0) {
					//console.log("SDFSADFSDAFSADF", socket.name)
					newRoomMaster(roomName, socket.id);
				}



				if (info[roomName].members.length == 0) {

					delete info[roomName]
					clearInterval(timer[roomName]);
				}
				refreshMain(info);
			}
		}






	})


	socket.on('mandateRoomMaster', function (roomName, socketID) {
		if (socket.name != info[roomName].members[0]) return;

		let sock = io.sockets.connected[socketID]
		let name = sock.name;

		if (info[roomName].members[0] == sock.name) return;

		for (i in info[roomName].members) {
			if (info[roomName].members[i] == name) {
				info[roomName].members.splice(i, 1);
				info[roomName].members.unshift(name);
				refreshMain(info);
				newRoomMaster(roomName, socketID)
				break;
			}
		}



	})


	socket.on('kick', function (roomName, socketID) {
		if (socket.name != info[roomName].members[0]) return;
		let sock = io.sockets.connected[socketID]
		//console.log(socketID);
		let name = sock.name;

		if (info[roomName].members[0] == sock.name) return;

		for (i in info[roomName].members) {
			if (info[roomName].members[i] == name) {
				sock.emit('kickedRoom', roomName, name, sock.id, 1);
				io.to(roomName).emit('kickedRoom', roomName, name, sock.id, 0);
				sock.leave(roomName);
				info[roomName].members.splice(i, 1);
			}
		}
		if (info[roomName].members.length == 0) {
			delete info[roomName]

		}
		refreshMain(info);

	})

	socket.on('sendChat', function (roomName, text) {



		let socketID = socket.id;
		let sock = io.sockets.connected[socketID]
		let name = sock.name;

		if (!text) return;

		if (text.charAt(0) == '/') {
			let code = text.substring(1, text.length);
			if (code.split(' ')[0] == "sj") {
				if (code.split(' ')[1]) {
					info[roomName].gameState.jobArray = code.split(' ')[1].split(',')
					console.log(code.split(' ')[1].split(','))
					socket.emit('gameMessage', `${code.split(' ')[1]}로 설정됨.`)
				}
			}
			return;
		}


		if (!info[roomName].isPlaying) {

			socket.broadcast.to(roomName).emit('receiveChat', socket.id, roomName, name, text, "normal", 0);
			socket.emit('receiveChat', socket.id, roomName, name, text, "normal", 1);

		} else {

			if (getJobName(roomName, name) != "dead") {
				if (info[roomName].gameState.time == "day" || info[roomName].gameState.time == "vote" || info[roomName].gameState.time == "final") {

					socket.broadcast.to(info[roomName].roomKey.alive).emit('receiveChat', socket.id, roomName, name, text, "normal", 0);
					socket.emit('receiveChat', socket.id, roomName, name, text, "normal", 1);
				} else if (info[roomName].gameState.time == "night") {
					if (getJobName(roomName, name) == "mafia") {
						socket.broadcast.to(info[roomName].roomKey.mafia).emit('receiveChat', socket.id, roomName, name, text, "mafia", 0);
						socket.emit('receiveChat', socket.id, roomName, name, text, "mafia", 1);
						console.log(text);
					} else if (getJobName(roomName, name) == "shaman") {
						socket.broadcast.to(info[roomName].roomKey.dead).emit('receiveChat', socket.id, roomName, name, text, "normal", 0);
						socket.emit('receiveChat', socket.id, roomName, name, text, "normal", 1);
					} else if (mafiaTeam.includes(getJobName(roomName, name)) && getIsContacted(roomName, name)) {
						socket.broadcast.to(info[roomName].roomKey.mafia).emit('receiveChat', socket.id, roomName, name, text, "mafia", 0);
						socket.emit('receiveChat', socket.id, roomName, name, text, "mafia", 1);
					}

				} else if (info[roomName].gameState.time == "appeal") {
					if (info[roomName].gameState.appeal == name) {
						socket.broadcast.to(info[roomName].roomKey.alive).emit('receiveChat', socket.id, roomName, name, text, "normal", 0);
						socket.emit('receiveChat', socket.id, roomName, name, text, "normal", 1);
					}
				}
			} else {
				socket.broadcast.to(info[roomName].roomKey.dead).emit('receiveChat', socket.id, roomName, name, text, "dead", 0);
				socket.emit('receiveChat', socket.id, roomName, name, text, "dead", 1);
			}


		}

	})


	socket.on('makeRoom', function (roomName, password, roomLimit) {

		roomName = xss(roomName);
		if (!info.hasOwnProperty(roomName)) {
			info[roomName] = {
				"members": [], "password": password, "limit": roomLimit, "isPlaying": 0,
				"gameState": {
					"time": "", "date": 0, "job": {}, "appeal": "", "jobArray": []
				},
				"roomKey": {}, "type": GAME_TYPE,
			}
		}
		console.log(info[roomName])
	})


	socket.on('requestName', function (socketID) {
		let sock = io.sockets.connected[socketID];
		socket.emit("getName", sock.name);
	})



	socket.on('startGame', function (roomName) {
		info[roomName].isPlaying = 1;
		refreshMain(info);

		io.to(roomName).emit('startGame');

		initGame(roomName);



	})


	socket.on('endGame', function (roomName) {
		endgame(roomName);
	})


	socket.on('selectPlayer', function (roomName, selected) {
		console.log(`${socket.name} 이  ${selected} 을 지목..`);

		if (info[roomName].gameState.time == "vote") {
			if (!getSelected(roomName, socket.name)) {
				info[roomName].gameState.job[socket.name].selected = selected;
				io.to(roomName).emit('votedPlayer', selected);
				socket.emit('selectPlayerUnavailable', "");
			}
		} else if (info[roomName].gameState.time == "night") {
			let selectActived = 0;
			if (getJobName(roomName, socket.name) == "mafia") {
				info[roomName].gameState.job[socket.name].selected = selected;
				selectActived = 1;
				let mafiaList = getJobOwner(roomName, "mafia");
				if (mafiaList.length > 1) {
					for (let i in mafiaList) {
						let socketID = info[roomName].gameState.job[mafiaList[i]].socketID;
						let sock = io.sockets.connected[socketID];
						sock.emit('mafiaSelected', selected);
						info[roomName].gameState.job[mafiaList[i]].selected = selected;
					}

				}

			} else if (getJobName(roomName, socket.name) == "doctor") {
				info[roomName].gameState.job[socket.name].selected = selected;
				selectActived = 1;

			} else if (getJobName(roomName, socket.name) == "police" && hasAbility(roomName, socket.name)) {
				info[roomName].gameState.job[socket.name].selected = selected;
				selectActived = 1;
				if (getJobName(roomName, selected) == "mafia") {
					socket.emit('policeResult', selected, 1);
				} else {
					socket.emit('policeResult', selected, 0);
				}
				info[roomName].gameState.job[socket.name].ability = 0;
				socket.emit('selectPlayerUnavailable', "");
			} else if (getJobName(roomName, socket.name) == "shaman" && hasAbility(roomName, socket.name)) {
				info[roomName].gameState.job[socket.name].selected = selected;
				selectActived = 1;
				socket.emit('shamanResult', selected, getOriginalJobName(roomName, selected));
				info[roomName].gameState.job[socket.name].ability = 0;
				socket.emit('selectPlayerUnavailable', "");

			} else if (getJobName(roomName, socket.name) == "reporter" && hasAbility(roomName, socket.name) && info[roomName].gameState.date >= 2) {
				info[roomName].gameState.job[socket.name].selected = selected;
				selectActived = 1;
			} else if (getJobName(roomName, socket.name) == "detective" && hasAbility(roomName, socket.name)) {
				info[roomName].gameState.job[socket.name].selected = selected;
				selectActived = 1;
				info[roomName].gameState.job[socket.name].ability = 0;
				socket.emit('selectPlayerUnavailable');
				socket.emit('gameMessage', "조사를 시작합니다.")

			} else if (getJobName(roomName, socket.name) == "priest" && hasAbility(roomName, socket.name)) {
				info[roomName].gameState.job[socket.name].selected = selected;
				selectActived = 1;

			} else if (getJobName(roomName, socket.name) == "spy" && hasAbility(roomName, socket.name)) {
				info[roomName].gameState.job[socket.name].selected = selected;
				selectActived = 1;
				if (getJobName(roomName, selected) == "mafia") {
					socket.emit('spyResult', selected, getJobName(roomName, selected));

					if (!getIsContacted(roomName, socket.name)) {
						info[roomName].gameState.job[socket.name].contacted = 1;
						socket.join(info[roomName].roomKey.mafia);
						let currentMafiaTeam = {}
						for (member of info[roomName].members) {
							if (mafiaTeam.includes(getJobName(roomName, member))) {
								currentMafiaTeam[member] = getJobName(roomName, member);
							}
						}
						for (member in currentMafiaTeam) {
							let socketID = info[roomName].gameState.job[member].socketID;
							let sock = io.sockets.connected[socketID];
							sock.emit('mafiaContacted', currentMafiaTeam);
						}

					}


				} else {
					socket.emit('spyResult', selected, getJobName(roomName, selected));
				}
				info[roomName].gameState.job[socket.name].ability = 0;
				socket.emit('selectPlayerUnavailable', "");
			}

			if (selectActived) {
				let detectiveList = getJobOwner(roomName, "detective");
				for (i in detectiveList) {
					if (getSelected(roomName, detectiveList[i]) == socket.name) {
						let socketID = info[roomName].gameState.job[detectiveList[i]].socketID;
						let sock = io.sockets.connected[socketID];
						sock.emit('detectiveResult', socket.name, getSelected(roomName, socket.name));
					}

				}
			}

		} else if (info[roomName].gameState.time == "final") {
			info[roomName].gameState.job[socket.name].selected = selected;
		}


	})

	socket.on('lengthenTime', function (roomName) {
		if (info[roomName].gameState.time == "day") {
			timeLimit[roomName] = timeLimit[roomName] + 15;
		}

	})

	socket.on('shortenTime', function (roomName) {
		if (info[roomName].gameState.time == "day") {
			timeLimit[roomName] = timeLimit[roomName] - 15;
		}
	})

})











http.listen(process.env.PORT || 3000, function () {
	console.log('server on..');
	connectDB()
});

reload(app)
