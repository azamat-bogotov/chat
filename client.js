// Создаем текст сообщений для событий
strings = {
	'connected': '[sys][time]%time%[/time]: Вы успешно соединились к сервером как [user]%name%[/user].[/sys]',
	'userJoined': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] присоединился к чату.[/sys]',
	'messageSent': '[out][time]%time%[/time]: [user]%name%[/user]: %text%[/out]',
	'messageReceived': '[in][time]%time%[/time]: [user]%name%[/user]: %text%[/in]',
	'userSplit': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] покинул чат.[/sys]',
    'renamed': '[sys][time]%time%[/time]: Вы успешно изменили имя [user]%name%[/user].[/sys]',
    'userRenamed': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] сменил имя.[/sys]'
};

serverHost = 'http://192.168.88.68:8081';

function log(msg)
{
    var time = (new Date).toLocaleTimeString();
    
    document.querySelector('#info').innerHTML += time + ': ' + msg + '<br />';
    document.querySelector('#info').scrollTop = document.querySelector('#info').scrollHeight;
}

window.onload = function() {
    // Создаем соединение с сервером; websockets почему-то в Хроме не работают, используем xhr
	if (navigator.userAgent.toLowerCase().indexOf('chrome') != -1) {
		socket = io.connect(serverHost, {'transports': ['xhr-polling']});
	} else {
		socket = io.connect(serverHost);
	}
    
    socket.on('connecting', function () {
        log('connecting...');
    });
    
    socket.on('disconnect', function () {
        log('disconnect...');
    });
    
    socket.on('connect_failed', function () {
        log('connect_failed...');
    });
    
    socket.on('error', function () {
        log('error...');
    });
    
    socket.on('reconnect_failed', function () {
        log('reconnect_failed...');
    });
    
    socket.on('reconnect', function () {
        log('reconnect...');
    });
    
    socket.on('reconnecting', function () {
        log('reconnecting...');
    });
    
    socket.on('message', function (msg) {
        document.querySelector('#log').innerHTML += strings[msg.event]
                                                  .replace(/\[([a-z]+)\]/g, '<span class="$1">')
                                                  .replace(/\[\/[a-z]+\]/g, '</span>')
                                                  .replace(/\%time\%/, msg.time)
                                                  .replace(/\%name\%/, msg.name)
                                                  .replace(/\%text\%/, unescape(msg.text)
                                                  .replace('<', '&lt;')
                                                  .replace('>', '&gt;')) + '<br>';
        
        document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
    });
    
	socket.on('connect', function () {
        log('connected...');
        
		document.querySelector('#input').onkeypress = function(e) {
			if (e.which == '13') {
        		socket.send(escape(document.querySelector('#input').value));
        		document.querySelector('#input').value = '';
			}
		};
        
		document.querySelector('#send').onclick = function() {
            socket.send(escape(document.querySelector('#input').value));
			document.querySelector('#input').value = '';
		};
        
        document.querySelector('#renameBtn').onclick = function() {
            socket.emit('changename', escape(document.querySelector('#userName').value));
            document.querySelector('#userName').value = '';
		};
        
        document.querySelector('#rooms').onchange = function() {
            document.querySelector('#log').innerHTML = "";
            socket.emit('changeroom', escape(document.querySelector('#rooms').value));
		};
	});
};
