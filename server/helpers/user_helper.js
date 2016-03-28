var Promise = require('bluebird');

module.exports = function () {
  var user_Helper = {};

  user_Helper.getUser = function(id) {
    return user_Model.findOne({where:{id: id}});
  };

  user_Helper.getLoggedInUser = function(req) {
    if(typeof req.session != 'undefined' && typeof req.session.token != 'undefined') {
      var userData = this.helpers.auth.decodeToken(req.session.token);
      return this.getUser(userData.id);
    }
    else {
      return this.helpers.general.getErrorMessagePromise('No logged in user.');
    }
  };

  user_Helper.getLoggedInUserId = function(req) {
    return this.getLoggedInUser(req)
    .then(function(user){
      var result = false;
      if(user != false) {
        result = user.get('id');
      }
      return result;
    });
  };

  return user_Helper;
}