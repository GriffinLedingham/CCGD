function Player() {};

Player.player;
Player.facing = 'left';
Player.jumpTimer;
Player.cursors;
Player.jumpButton;
Player.id;

Player.prototype.init = function(data, game, networked){
  this.game_parent = game;
  this.game = game.instance;

  this.id = data.character.id;
  console.log(data.character);

  if(data.character.last_x > 0 && data.character.last_y > 0){
    this.player = this.game.add.sprite(data.character.last_x*16, data.character.last_y*16, 'dude');
  }
  else{
    this.player = this.game.add.sprite(32, 32, 'dude');
  }

  if(!networked) {
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

    this.player.body.bounce.y = 0.2;
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(20, 32, 5, 16);

    this.follow();
  }
  // else {
  //   this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
  // }

  this.player.animations.add('left', [0, 1, 2, 3], 10, true);
  this.player.animations.add('turn', [4], 20, true);
  this.player.animations.add('right', [5, 6, 7, 8], 10, true);

  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  this.jumpTimer = 0;

  this.game_parent.players[this.id] = this;

  var socket = SocketManager.getSocket();
};

Player.prototype.follow = function(){
  this.game.camera.follow(this.player);
};

Player.prototype.animate = function(x, y, duration){
  var xDelta = x - this.player.x;
  var yDelta = y - this.player.y;
  var totalTime = 0;
  var that = this;
  var animTime = function(){
    setTimeout(function(){
      totalTime += duration/20;
      that.player.x += xDelta/20;
      that.player.y += yDelta/20;
      if(totalTime != duration){
        animTime();
      }
    }, duration/20);
  };
  animTime();
};

global.Player = module.exports = Player;