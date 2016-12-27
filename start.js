var http = require('http');
var path = require('path');
var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

//Normalize a port into a number, string, or false.

var httpServer = http.createServer(app);

var port = normalizePort(process.env.PORT || '5009');
app.set('port', port);
httpServer.listen(port);
console.log("Server running on port : " + port);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

