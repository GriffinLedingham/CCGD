function Map() {};

Map.tilemap = null;
Map.grid = null;
Map.height = null;
Map.width = null;
Map.tileHeight = null;
Map.tileWidth = null;
Map.characters = null;

Map.prototype.init = function(id) {
  this.tilemap = require('../maps/' + id + '.js');
  this.height = this.tilemap.height;
  this.width = this.tilemap.width;
  this.tileHeight = this.tilemap.tileHeight;
  this.tileWidth = this.tilemap.tileWidth;
  this.grid = buildGrid(this.tilemap, this.width, this.height);
  this.characters = {};
};

Map.prototype.addCharacter = function(character){
  this.characters[character.id] = character;
};

Map.prototype.updateCharacterCoords = function(x, y, characterId){
  if(typeof this.characters[characterId] != 'undefined'){
    this.characters[characterId].last_x = x;
    this.characters[characterId].last_y = y;
  }
};

Map.prototype.removeCharacter = function(characterId){
  delete this.characters[characterId];
};

Map.prototype.getCharacters = function(){
  return this.characters;
};

var buildGrid = function(data, width, height){
  var grid = [];
  for(var i = 0;i<height;i++) {
    var row = [];
    for(var j = 0;j<width;j++) {
      //This needs to be adjusted to hit detect on the hit layer, not the last layer in index
      row.push(data.layers[data.layers.length-1].data[(i*width) + j]);
    }
    grid.push(row);
  }
  return grid;
};

module.exports = Map;