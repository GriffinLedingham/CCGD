function Map() {};

Map.tileHeight = null;
Map.tileWidth = null;

Map.prototype.init = function(data, game){
  this.game_parent = game;
  this.game = game.instance;

  this.tileHeight = data.map.tilemap.tileheight;
  this.tileWidth = data.map.tilemap.tilewidth;

  this.game.load.tilemap('map'+data.id, null, data.map.tilemap, Phaser.Tilemap.TILED_JSON);

  this.game.map = this.game.add.tilemap('map'+data.id);
  this.game.map.addTilesetImage('tiles-1');
  this.game.map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
  this.game.layer = this.game.map.createLayer('Tile Layer 1');

  this.game.layer.resizeWorld();
};

Map.prototype.getTile = function(x, y) {
  return {x:Math.floor(x/this.tileWidth),y:Math.floor(y/this.tileHeight)};
};

global.Map = module.exports = Map;