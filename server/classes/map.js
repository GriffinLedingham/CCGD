function Map() {};

//Move this to a map data file, to correspond with a tiled map
Map.tilemap = null;
Map.grid = null;
Map.height = null;
Map.width = null;
Map.tileHeight = null;
Map.tileWidth = null;

Map.prototype.init = function(id) {
  this.tilemap = require('../maps/' + id + '.js');
  this.height = this.tilemap.height;
  this.width = this.tilemap.width;
  this.tileHeight = this.tilemap.tileHeight;
  this.tileWidth = this.tilemap.tileWidth;
  this.grid = buildGrid(this.tilemap, this.width, this.height);
};

var buildGrid = function(data, width, height){
  var grid = [];
  for(var i = 0;i<height;i++) {
    var row = [];
    for(var j = 0;j<width;j++) {
      row.push(data.layers[0].data[(i*width) + j]);
    }
    grid.push(row);
  }
  return grid;
};

module.exports = Map;