function User() {};

User.id = null;
User.characterId = null;
User.character = null;
User.username = null;
User.mapId = null;
User.currentMap = null;
User.position = {x:0,y:0};
User.easyStar = null;

User.prototype.init = function(socket){
  this.socket = socket;
  this.setupBindings();

  var EasyStar = require('easystarjs');
  this.easyStar = new EasyStar.js();

  var that = this;
  var doEasyLoop = setInterval(function() {
    that.easyStar.setIterationsPerCalculation(1000);
    that.easyStar.calculate();
  }, 30);
};

User.prototype.setupBindings = function(){
  var that = this;
  this.socket.on('login_post', function(data){
    auth_Helper.loginUser(data.username,data.password)
    .then(function(response){
      if(typeof response.user != 'undefined'){
        that.id = response.user.id;
        that.username = response.user.username;
      }
      that.socket.emit('login_callback', response);
    });
  });

  this.socket.on('get_character_list', function(){
    character_Helper.getUserCharacters(that.id)
    .then(function(characters){
      that.socket.emit('character_select_callback', {characters: characters});
    })
  });

  this.socket.on('create_character', function(data){
    character_Helper.createCharacter(data.name,that.id)
    .then(function(response){
      that.socket.emit('character_select_callback', {characters:response});
    });
  });

  this.socket.on('get_character', function(data){
    character_Helper.getCharacter(data.characterId)
    .then(function(response){
      that.characterId = response.character.id;
      that.character = response.character;
      that.socket.emit('character_data_callback', response);
    });
  });

  this.socket.on('load_map', function(data){
    var map = MapManager.getMap(data.mapId);
    that.currentMap = map.map;
    that.easyStar.setGrid(map.map.grid);
    that.easyStar.setAcceptableTiles([0]);
    character_Helper.getCharacter(that.characterId)
    .then(function(response){
      that.mapId = data.mapId;
      that.joinRoom('map_' + data.mapId);
      that.socket.emit('map_data_callback', {
        map: map,
        character: response.character
      });
    });
  });

  this.socket.on('user_move', function(data){
    that.position = {x: data.x, y: data.y};
    that.socket.broadcast.to('map_' + that.mapId).emit('user_coords_callback', {x: that.position.x, y: that.position.y, id: that.characterId});
  });

  that.socket.on('click_tile', function(data){
    that.easyStar.findPath(Math.floor(that.position.x), Math.floor(that.position.y), data.x, data.y, function( path, er ) {
      if (path === null) {
        console.log(path);
      } else {
          console.log(path);
          var setTime = function(){
            setTimeout(function(){
              var coords = path.shift();
              console.log(coords);
              that.position = {x: coords.x, y: coords.y};
              character_Helper.updateCharacter(that.characterId, {last_x: that.position.x, last_y: that.position.y});
              io.sockets.in('map_' + that.mapId).emit('user_coords_callback', {x: coords.x, y: coords.y, id: that.characterId});
              if(path.length > 0) {
                setTime();
              }
            },100);
          };
          setTime();
      }
    });
  });

  this.socket.on('disconnect', function () {
    console.log('UserClass :: Saving Character Data');
    if(typeof that.position != 'undefined') {
      character_Helper.updateCharacter(that.characterId, {last_x: that.position.x, last_y: that.position.y});
      that.socket.broadcast.to('map_' + that.mapId).emit('player_disconnect', {id: that.characterId});
    }
  });

};

User.prototype.joinRoom = function(room) {
  for(room_key in this.socket.rooms) {
    this.socket.leave(room_key);
  }
  console.log('Socket.io :: Joined Room: ' + room);
  this.socket.join(room);
}

global.User = module.exports = User;