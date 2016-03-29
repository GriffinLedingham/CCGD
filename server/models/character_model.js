var Sequelize = require('sequelize');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var config = require('../config/model_config');
var _ = require('lodash');

module.exports = function(db, store) {
  var that = this;
  var CharacterModel = db.define("Character", {
    name: { type: Sequelize.STRING, required: true },
  },{
    classMethods: {
      associate: function() {
        CharacterModel.belongsTo(user_Model, {foreignKeyConstraint: true});
      },
      createCharacter: function(name, userId) {
        var data = {
          name: name,
          UserId: userId
        };
        return CharacterModel.create(data)
        .then(function(character) {
          var result = {txn:false};
          if(character != null) result = {txn: true, character: character};
          return result;
        });
      },
      getUserCharacters: function(userId) {
        return CharacterModel.findAll({where:{UserId:userId}});
      },
      getCharacter: function(characterId) {
        return CharacterModel.findOne({where:{id:characterId}})
        .then(function(character) {
          var result = {txn:false};
          if(character != null) result = {txn: true, character: character};
          return result;
        });
      }
    }
  });

  return CharacterModel;
}
