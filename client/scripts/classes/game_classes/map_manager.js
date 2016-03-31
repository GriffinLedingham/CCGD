function MapManager() {};

MapManager.game = null;

MapManager.prototype.init = function(game){
  this.game = game.instance;
};

MapManager.prototype.loadMap = function(data){
  this.game.load.tilemap('map'+data.id, null, data.map.grid, Phaser.Tilemap.TILED_JSON);

  this.game.map = this.game.add.tilemap('map'+data.id);
  this.game.map.addTilesetImage('tiles-1');
  this.game.map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
  console.log(this.game);
  this.game.layer = this.game.map.createLayer('Tile Layer 1');

  this.game.layer.resizeWorld();
};

global.MapManager = module.exports = MapManager;