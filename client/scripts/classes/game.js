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
  this.load.tilemap('level1', 'images/level1.json', null, Phaser.Tilemap.TILED_JSON);
  this.load.image('tiles-1', 'images/tiles-1.png');
  this.load.spritesheet('dude', 'images/dude.png', 32, 48);
  this.load.spritesheet('droid', 'images/droid.png', 32, 32);
  this.load.spritesheet('guy', 'images/runningRpg.png');
  this.load.image('starSmall', 'images/star.png');
  this.load.image('starBig', 'images/star2.png');
  this.load.image('background', 'images/background2.png');
};

Game.prototype.create = function(){
  this.physics.startSystem(Phaser.Physics.ARCADE);

  this.stage.backgroundColor = '#000000';

  this.bg = this.add.tileSprite(0, 0, 800, 600, 'background');
  this.bg.fixedToCamera = true;

  // this.physics.arcade.gravity.y = 250;

  game.instance.input.onDown.add(clickHandle, this);
};

Game.prototype.update = function(){
  var socket = SocketManager.getSocket();
  var that = this;
  var count = 0;
  _.each(game.players,function(player){
    if(player.id == game.active_character.id) {
      that.physics.arcade.collide(player.player, game.instance.layer);

      _.each(game.players, function(collide_player) {
        that.physics.arcade.collide(player.player, collide_player);
      });

      player.player.body.velocity.x = 0;

      if (player.cursors.left.isDown)
      {
          player.player.body.velocity.x = -150;

          if (player.facing != 'left')
          {
              player.player.animations.play('left');
              player.facing = 'left';
          }
      }
      else if (player.cursors.right.isDown)
      {
          player.player.body.velocity.x = 150;

          if (player.facing != 'right')
          {
              player.player.animations.play('right');
              player.facing = 'right';
          }
      }
      else
      {
          if (player.facing != 'idle')
          {
              player.player.animations.stop();

              if (player.facing == 'left')
              {
                  player.frame = 0;
              }
              else
              {
                  player.frame = 5;
              }

              player.facing = 'idle';
          }
      }
      if(player.player.body.onFloor()) {game.instance.time.now > player.jumpTimer}

      if (player.jumpButton.isDown && player.player.body.onFloor() && game.instance.time.now > player.jumpTimer)
      {
          player.player.body.velocity.y = -250;
          player.jumpTimer = game.instance.time.now + 750;
      }

      if(game.active_character != null && typeof game.active_character != 'undefined'){
        // socket.emit('user_move', {x:player.player.x,y:player.player.y,id:game.active_character.id});
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
        // game.players[data.id].player.x = data.lastPos.x*16;
        // game.players[data.id].player.y = data.lastPos.y*16;
        game.players[data.id].animate(data.x*16, data.y*16, data.duration);
      }
      else {
        game.players[data.id].player.x = data.x*16;
        game.players[data.id].player.y = data.y*16;
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