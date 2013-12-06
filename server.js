var io   = require('socket.io').listen(8081);
var User = require('./user');
var fs   = require('fs');

io.set('log level', 1);

var rooms = {'default': 'all', 'private': 'private'};

io.sockets.on('connection', function (socket) {
    var time    = (new Date).toLocaleTimeString();
    socket.user = new User((socket.id).toString(), rooms.default);
    
    socket.join(socket.user.getRoom());
    
    socket.json.send({'event': 'connected', 'name': socket.user.getName(), 'time': time});
    socket.broadcast.to(socket.user.getRoom())
                    .json.send({'event': 'userJoined', 'name': socket.user.getName(), 'time': time});
    
    socket.on('changename', function(newUserName) {
        // необходимо получить данные пользователя из сессии|БД|redis|memcache
        socket.user.setName(newUserName);
        socket.json.send({'event': 'renamed', 'name': socket.user.getName(), 'time': time});
        socket.broadcast.json.send({'event': 'userRenamed', 'name': socket.user.getName(), 'time': time});
    });

    socket.on('changeroom', function(newRoom) {
        // необходимо получить данные пользователя из сессии|БД|redis|memcache
        socket.leave(socket.user.getRoom());
        socket.join(newRoom);
        
        socket.broadcast.to(socket.user.getRoom())
                        .json.send({'event': 'userSplit', 'name': socket.user.getName(), 'time': time});
        
        socket.user.setRoom(newRoom);
        
        socket.json.send({'event': 'connected', 'name': socket.user.getName(), 'time': time});
        socket.broadcast.to(socket.user.getRoom())
                        .json.send({'event': 'connected', 'name': socket.user.getName(), 'time': time});
    });
    
	socket.on('message', function (msg) {
		var time = (new Date).toLocaleTimeString();
        
        fs.appendFile('./chat.log', '{"text":"' + escape(msg) + '","time":"' + time + '"}\n', function(err) {
            if (err) {
                throw err;
                console.log('Error append data to file: "chat.log". ' + err);
            }
        });
        
        socket.json.send({'event': 'messageSent', 'name': socket.user.getName(), 'text': msg, 'time': time});
        socket.broadcast.to(socket.user.getRoom()).json.send({'event': 'messageReceived', 'name': socket.user.getName(), 'text': msg, 'time': time})
	});
    
	// При отключении клиента - уведомляем остальных
	socket.on('disconnect', function() {
		var time = (new Date).toLocaleTimeString();
		io.sockets.in(socket.user.getRoom()).json.send({'event': 'userSplit', 'name': socket.user.getName(), 'time': time});
        socket.leave(socket.user.getRoom());
	});
});
