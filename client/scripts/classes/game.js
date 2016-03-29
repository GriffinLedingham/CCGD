function Game() {};

Game.prototype.init = function(id){
  this.instance = new Phaser.Game( window.innerWidth, window.innerHeight, Phaser.AUTO, id, {
      preload: this.preload,
      create: this.create,
      update: this.update,
      render: this.render
  });
};

Game.prototype.preload = function(){

};

Game.prototype.create = function(){

};

Game.prototype.update = function(){

};

Game.prototype.render = function(){

};

global.Game = module.exports = Game;