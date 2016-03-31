var config = require('../config/map_config');

var MapManager = {};
MapManager.maps = {};

MapManager.init = function(){
  for(index in config.maps) {
    console.log('Spawning Map ' + index);
    this.maps[index] = new Map();
    this.maps[index].init(index);
  }
};

MapManager.getMap = function(id) {
  return {map: this.maps[id], id: id};
};

module.exports = MapManager;