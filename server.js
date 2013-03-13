//Chat server
var express = require('express');
var app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , fs= require('fs');
//listen for requests on Openshift
//app.listen(process.env.OPENSHIFT_INTERNAL_PORT || 8080, process.env.OPENSHIFT_INTERNAL_IP);
//listen for requests on 8000 port
server.listen(8000);
// Routing
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/chatclienthead.html');
});

app.post('/uploads', function (req, res) {
    res.send(console.dir(req.files));

  /*  fs.readFile(req.files.uploaded_file.path, function (err, data) {
        if(err){
            console.log(err);
        }
        var newPath = __dirname + "/uploads";
        fs.rename(newPath, data, function (err) {
            res.redirect("back");
        });
    });*/
});

//declare variable to store all connected users
var connected_users=[];
io.sockets.on('connection', function (socket) {

    // Handles connection of clients
    socket.on('got_user', function (msg) {
        // Get the variable 'username'
        socket.set('username', msg, function() {
            connected_users.push(msg);
            console.log('Connect ', msg);
            var connected_msg = msg + ' is now connected.';

            // Broadcast to all users the connection message
            io.sockets.volatile.emit('broadcast_msg', connected_msg);
            io.sockets.volatile.emit('online_users', connected_users);
        });
    });

    // Handle posted messages of clients
    socket.on('emit_msg', function (msg) {
        // Get the variable 'username'
        socket.get('username', function (err, username) {
            console.log('Chat message by ', username);
            var post_msg=username + ' : ' + msg;
            // Broadcast to all users the posted message
            io.sockets.volatile.emit( 'broadcast_msg' , post_msg);
        });
    });

    // Handle disconnection of clients
    socket.on('disconnect', function () {
        socket.get('username', function (err, username) {
            connected_users.splice(connected_users.indexOf(username), 1);
            console.log('Disconnect ', username);
            var disconnected_msg = username + ' has disconnected.'

            // Broadcast to all users the disconnection message
            io.sockets.volatile.emit( 'broadcast_msg' , disconnected_msg);
            io.sockets.volatile.emit('online_users', connected_users);
        });
    });
});