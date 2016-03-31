function User() {};

User.id = null;
User.characterId = null;
User.character = null;
User.username = null;
User.mapId = null;
User.position = {x:0,y:0};

User.prototype.init = function(socket){
  this.socket = socket;
  this.setupBindings();
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
    that.socket.broadcast.to('map_' + that.mapId).emit('user_coords_callback', {x: data.x, y: data.y, id: that.characterId});
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