var easyStar = new EasyStar.js()

function Map() {};

//Move this to a map data file, to correspond with a tiled map
Map.grid = null;

Map.prototype.init = function(id) {
  this.grid = require('../maps/' + id + '.js');
};

module.exports = Map;