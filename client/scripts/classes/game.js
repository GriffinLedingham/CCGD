function Game() {};

Game.prototype.init = function(id){
  this.instance = new Phaser.Game( window.innerWidth, window.innerHeight, Phaser.AUTO, id, {
      preload: this.preload,
      create: this.create,
      update: this.update,
      render: this.render
  });

  this.setupBindings();
};

Game.prototype.preload = function(){

};

Game.prototype.create = function(){

};

Game.prototype.update = function(){

};

Game.prototype.render = function(){

};

Game.prototype.setupBindings = function(){
  EventManager.on('load_game', 'game', function(data){

  });
};

global.Game = module.exports = Game;