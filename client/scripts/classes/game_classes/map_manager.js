function MapManager() {};

MapManager.game = null;

MapManager.prototype.init = function(game){
  this.game_parent = game;
  this.game = game.instance;
};

MapManager.prototype.loadMap = function(data){
  var map = new Map();
  map.init(data, this.game_parent);
  return map;
};

global.MapManager = module.exports = MapManager;