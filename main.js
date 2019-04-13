
// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
  
//   res.end('Hello World\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

var express = require('express');
var app = express();

app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));

app.get("/hello", function(req,res){
  res.render("hello", {name:req.query.nameQuery});
});

app.get("/hello/:nameParam", function(req,res){
  res.render("hello", {name:req.params.nameParam});
});

var port = process.env.PORT || 3000; //*
app.listen(port, function(){
  console.log('Server On!');
});