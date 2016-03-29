function User() {};

User.id = null;
User.username = null;

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
      that.socket.emit('character_data_callback', response);
    });
  });
};

global.User = module.exports = User;