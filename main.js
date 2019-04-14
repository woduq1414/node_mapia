const http = require('http');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  
  res.end('WOW My First NodeJs WOW');
});

server.listen(port, hostname, () => {
  console.log(`Serveeeeeeeeeeeeeeer running at http://${hostname}:${port}/`);
});
//sadfsdfs