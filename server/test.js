const http = require('http');
const server = http.createServer((req, res) => {

	res.writeHead(200, {
	'Content-Type': 'text/plain; charset=UTF-8'
	});
      res.end('Work on 89.111.169.54');
});

server.listen(3000, () => {
	console.log('start node on port 3000');
});
