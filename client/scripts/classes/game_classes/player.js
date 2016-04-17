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
  this.player = this.game.add.sprite(data.character.last_x*32, data.character.last_y*32, 'guy');

  if(!networked) {
    this.player.body.setSize(20, 32, 5, 16);
    this.follow();
  }

  this.setPlayerAnimations();
  this.setButtonBindings();
  this.game_parent.players[this.id] = this;
  var socket = SocketManager.getSocket();
};

Player.prototype.follow = function(){
  this.game.camera.follow(this.player);
};

Player.prototype.doAttack = function(attackName){
  if(this.attacking) return;
  this.attacking = true;
  this.current_attack = this.game.add.sprite(this.player.x, this.player.y, attackName);
  this.current_attack.anchor.x = 0.5;
  this.current_attack.anchor.y = 0.5;
  this.current_attack.x = this.player.x + this.player.width/2;
  this.current_attack.y = this.player.y + this.player.height/2;

  var duration = 1000;
  var animation = this.current_attack.animations.add('attack',[0,1,2,3,4], 20, false);
  animation.killOnComplete = true;
  var that = this;
  animation.onComplete.add(function(){
    that.attacking = false;
    that.current_attack = null;
  }, this);
  this.current_attack.animations.play('attack');
};

Player.prototype.positionCurrentAttack = function(){
  if(that.current_attack != null && typeof that.current_attack != 'undefined'){
    that.current_attack.x = that.player.x + that.player.width/2;that.current_attack.y = that.player.y + that.player.height/2;
  }
};

Player.prototype.animate = function(x, y, duration){
  var xDelta = x - this.player.x;
  var yDelta = y - this.player.y;
  console.log(xDelta, yDelta);
  this.animateSprite(xDelta, yDelta);
  var totalTime = 0;
  var that = this;
  var animTime = function(){
    setTimeout(function(){
      totalTime += duration/20;
      that.player.x += xDelta/20;
      that.player.y += yDelta/20;
      that.positionCurrentAttack();
      if(totalTime != duration){
        animTime();
      }
    }, duration/20);
  };
  animTime();
};

Player.prototype.setPlayerAnimations = function(){
  this.player.animations.add('left', [6,7,8], 5, true);
  this.player.animations.add('up', [0,1,2], 5, true);
  this.player.animations.add('right', [3,4,5], 5, true);
  this.player.animations.add('down', [9,10,11], 5, true);
};

Player.prototype.setButtonBindings = function(){
  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};

Player.prototype.animateSprite = function(x,y){
  if(x < 1 && x > -1){
    if(y > 0){
      this.player.animations.play('down');
    }else{
      this.player.animations.play('up');
    }
  }
  else if(y < 1 && y > -1){
    if(x > 0){
      this.player.animations.play('right');
    }else{
      this.player.animations.play('left');
    }
  }else if(x > y){
    if(x > 0){
      this.player.animations.play('right');
    }else{
      this.player.animations.play('left');
    }
  }else{
    if(y > 0){
      this.player.animations.play('down');
    }else{
      this.player.animations.play('up');
    }
  }
}

global.Player = module.exports = Player;