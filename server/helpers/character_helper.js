var Promise = require('bluebird');

module.exports = function () {
  var character_Helper = {};

  character_Helper.createCharacter = function(name, userId) {
    return character_Model.createCharacter(name, userId)
    .then(function(response){
      return character_Helper.getUserCharacters(response.character.get('UserId'));
    });
  };

  character_Helper.getUserCharacters = function(userId) {
    return character_Model.getUserCharacters(userId);
  };

  character_Helper.getCharacter = function(characterId) {
    return character_Model.getCharacter(characterId);
  };

  return character_Helper;
}