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

  if(data.character.last_x > 0 && data.character.last_y > 0){
    this.player = this.game.add.sprite(data.character.last_x, data.character.last_y, 'dude');
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

  this.player.animations.add('left', [0, 1, 2, 3], 10, true);
  this.player.animations.add('turn', [4], 20, true);
  this.player.animations.add('right', [5, 6, 7, 8], 10, true);

  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  this.jumpTimer = 0;

  this.game_parent.players[this.id] = this;
};

Player.prototype.follow = function(){
  this.game.camera.follow(this.player);
};

global.Player = module.exports = Player;