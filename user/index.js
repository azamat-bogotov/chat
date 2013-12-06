function User(name, room)
{
    this._name = name;
    this._room = room;
}

User.prototype.getName = function() {
    return this._name;
}

User.prototype.setName = function(name) {
    this._name = name;
}

User.prototype.getRoom = function() {
    return this._room;
}

User.prototype.setRoom = function(room) {
    this._room = room;
}

//exports.User = User; // var userPrefab = require('./user'); var user = userPrefab.User('name', 'room');
module.exports = User; // var User = require('./user'); var user = new User('name', 'room');