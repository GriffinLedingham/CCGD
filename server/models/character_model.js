var Sequelize = require('sequelize');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var config = require('../config/model_config');
var _ = require('lodash');

module.exports = function(db, store) {
  var that = this;
  var CharacterModel = db.define("Character", {
    name:     { type: Sequelize.STRING,  required: true },
    level:    { type: Sequelize.INTEGER, required: true },
    skin:     { type: Sequelize.INTEGER, required: true },
    last_map: { type: Sequelize.INTEGER, required: true},
    last_x:   { type: Sequelize.INTEGER, required: true},
    last_y:   { type: Sequelize.INTEGER, required: true}
  },{
    classMethods: {
      associate: function() {
        CharacterModel.belongsTo(user_Model, {foreignKeyConstraint: true});
      },
      createCharacter: function(name, userId) {
        var data = {
          name: name,
          UserId: userId,
          level: 1,
          skin: 0,
          last_map: 0,
          last_x: 3,
          last_y: 3
        };
        return CharacterModel.create(data)
        .then(function(character) {
          var result = {txn:false};
          if(character != null) result = {txn: true, character: character};
          return result;
        });
      },
      updateCharacter: function(characterId, data) {
        return CharacterModel.update(data, {where:{id:characterId}});
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
