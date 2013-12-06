<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Chat</title>
		<link href="style.css" rel="stylesheet">
		<script src="http://192.168.88.68:8081/socket.io/socket.io.js"></script>
		<script type="text/javascript" src="client.js?v=<?php echo time(); ?>"></script>
	</head>
	<body>
        <div id="log"></div><br>
		<input type="text" id="input"><input type="submit" id="send" value="Send"><br/>
        <input type="text" id="userName"><input type="button" id="renameBtn" value="Rename"><br/>
        
        <select id="rooms">
            <option selected value="all">Room1</option>
            <option value="private">Room2</option>
        </select><br/>
        
        <br/>
        <div id="info"></div>
	</body>
</html>
