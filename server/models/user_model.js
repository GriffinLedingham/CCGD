var Sequelize = require('sequelize');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var config = require('../config/model_config');
var _ = require('lodash');

module.exports = function(db, store) {
	var that = this;
	var UserModel = db.define("User", {
		username: { type: Sequelize.STRING, required: true },
		email   : { type: Sequelize.STRING, required: true },
		password: { type: Sequelize.STRING, required: true }
	},{
    scopes: {
      'general': ['id','username','email']
    },
    classMethods: {
      associate: function() {
        UserModel.belongsTo(store.Session, {
          foreignKeyConstraint: true
        });
      },
      createUser: function(username, password, email) {
        return bcrypt.genSaltAsync(10)
        .then(function(salt){ return bcrypt.hashAsync(password, salt)})
        .then(function(hash) {
          return UserModel.findOne({where:{username:username}})
          .then(function(user){
            if(user == null) {
              var data = {
                username: username,
                email: email,
                password: hash
              };
              return UserModel.create(data);
            }
            else {
              return 'This username is in use.';
            }
          });
        })
        .then(function(user) {
          var result = {txn:false};
          if(user != null && typeof user != 'undefined' && typeof user != 'string') result = {txn: true, user: user.filter()};
          if(typeof user == 'string') result.err = user;
          return result;
        });
      },
      getUser: function(userId, options) {
        return UserModel.findOne({where:{id:userId}})
        .then(function(user) {
          var result = false;
          if(user != null) result = user;
          return result;
        });
      },
      getUserByUsername: function(userName) {
        return UserModel.findOne({where:{username:userName}})
        .then(function(user) {
          var result = false;
          if(user != null) result = user;
          return result;
        });
      }
    },
    instanceMethods: {
      filter: function() {
        return _.pick(this, config.fields['user']);
      }
    }
  });

	return UserModel;
}
