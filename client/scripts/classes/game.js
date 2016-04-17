function Game() {};

Game.prototype.init = function(id){
  this.instance = new Phaser.Game( window.innerWidth, window.innerHeight, Phaser.AUTO, id, {
      preload: this.preload,
      create: this.create,
      update: this.update,
      render: this.render
  });

  this.mapManager = new MapManager();
  this.mapManager.init(game);

  this.characterManager = new CharacterManager();
  this.characterManager.init(game);

  this.map;
  this.tileset;
  this.layer;
  this.players = {};
  this.active_character;
  this.bg;

  this.setupEvents();
};

Game.prototype.preload = function(){
  this.load.image('grass_tilemap', 'images/grass_tilemap.png');
  this.load.spritesheet('dude', 'images/dude.png', 32, 48);
  this.load.spritesheet('droid', 'images/droid.png', 32, 32);
  this.load.spritesheet('guy', 'images/guysmall.png', 29.8, 48);
  this.load.spritesheet('slash1', 'images/slash4.png', 75, 75);
  this.load.image('starSmall', 'images/star.png');
  this.load.image('starBig', 'images/star2.png');
  this.load.image('background', 'images/background2.png');
};

Game.prototype.create = function(){
  this.stage.backgroundColor = '#000000';
  game.instance.input.onDown.add(clickHandle, this);
};

Game.prototype.update = function(){
  var socket = SocketManager.getSocket();
  var that = this;
  var count = 0;
  _.each(game.players,function(player){
    if(player.id == game.active_character.id) {
      if(player.jumpButton.isDown){
        player.doAttack('slash1');
      }
    }
    count++;
  });
};

Game.prototype.render = function(){

};

Game.prototype.setupEvents = function(){
  var that = this;
  var socket = SocketManager.getSocket();

  EventManager.on('load_game', 'game', function(data){
    if(typeof data.character != 'undefined') {
      socket.emit('load_map', {mapId: data.character.last_map});
    }
  });

  BindingManager.setupBinding({
    parent:   socket,
    key:      'map_data_callback',
    callback: function(data){
      game.map = that.mapManager.loadMap(data.map);
      that.characterManager.loadCharacter(data);
      game.active_character = data.character;
    }
  });

  BindingManager.setupBinding({
    parent:   socket,
    key:      'player_disconnect',
    callback: function(data){
      game.players[data.id].player.destroy();
      delete game.players[data.id];
    }
  });

  BindingManager.setupBinding({
    parent:   socket,
    key:      'user_coords_callback',
    callback: function(data){
      if(typeof game.players[data.id] == 'undefined') {
        that.characterManager.loadNetworkedCharacter({character: data});
      }
      if(data.lastPos != undefined){
        game.players[data.id].animate(data.x*32, data.y*32, data.duration);
      }
      else {
        game.players[data.id].player.x = data.x*32;
        game.players[data.id].player.y = data.y*32;
      }
    }
  });

  BindingManager.setupBinding({
    parent:   socket,
    key:      'user_coords_end_callback',
    callback: function(data){
      if(typeof game.players[data.id] != 'undefined') {
        game.players[data.id].player.animations.stop();
      }
    }
  });

};

var clickHandle = function(data){
  var socket = SocketManager.getSocket();

  var x = data.worldX;
  var y = data.worldY;

  if(typeof game.map != 'undefined') {
    var tile = game.map.getTile(x, y);
    socket.emit('click_tile', tile);
  }
};

global.Game = module.exports = Game;