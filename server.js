var io = require('socket.io').listen(8081);
io.set('log level', 1);

var rooms = {'default': 'all', 'private': 'private'};

io.sockets.on('connection', function (socket) {
    var time            = (new Date).toLocaleTimeString();
    
    socket.userName = (socket.id).toString();
    socket.room     = rooms.default;
    
    socket.join(socket.room);
    
    socket.json.send({'event': 'connected', 'name': socket.userName, 'time': time});
    socket.broadcast.to(socket.room).json.send({'event': 'userJoined', 'name': socket.userName, 'time': time});
    
    socket.on('changename', function(newUserName) {
        // необходимо получить данные пользователя из сессии|БД|redis|memcache
        socket.userName = newUserName;
        socket.json.send({'event': 'renamed', 'name': socket.userName, 'time': time});
        socket.broadcast.json.send({'event': 'userRenamed', 'name': socket.userName, 'time': time});
    });

    socket.on('changeroom', function(newRoom) {
        // необходимо получить данные пользователя из сессии|БД|redis|memcache
        socket.leave(socket.room);
        socket.join(newRoom);
        
        socket.broadcast.to(socket.room).json.send({'event': 'userSplit', 'name': socket.userName, 'time': time});
        socket.room = newRoom;
        
        socket.json.send({'event': 'connected', 'name': socket.userName, 'time': time});
        socket.broadcast.to(socket.room).json.send({'event': 'connected', 'name': socket.userName, 'time': time});
    });
    
	socket.on('message', function (msg) {
		var time = (new Date).toLocaleTimeString();
        socket.json.send({'event': 'messageSent', 'name': socket.userName, 'text': msg, 'time': time});
        socket.broadcast.to(socket.room).json.send({'event': 'messageReceived', 'name': socket.userName, 'text': msg, 'time': time})
	});
    
	// При отключении клиента - уведомляем остальных
	socket.on('disconnect', function() {
		var time = (new Date).toLocaleTimeString();
		io.sockets.in(socket.room).json.send({'event': 'userSplit', 'name': socket.userName, 'time': time});
        socket.leave(socket.room);
	});
});
