var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var crypto = require("crypto");

var sec = 'th1s1s4s3cree3e3e3e3e3e3e3e3e3t';

module.exports = function () {
  var auth_Helper = {};

  auth_Helper.signupUser = function(username, password, email) {
    var response = general_Helper.getErrorMessagePromise(signup_Lang.missingFields);
    if(typeof username != 'undefined'
      && typeof password != 'undefined'
      && typeof email != 'undefined' ) {
      response = user_Model.createUser(username, password, email);
    }
    return response;
  };

  auth_Helper.loginUser = function(username, password) {
    var that = this;
    return user_Model.getUserByUsername(username)
    .then(function(user){return that.comparePassword(password,user)});
  };

  auth_Helper.loginUserByToken = function(response) {
    var that = this;
    var result = {txn: false, err: login_Lang.noSession};
    if(response.txn) {
      var userData = that.decodeToken(response.token);
      var userId = userData.id;
      return user_Model.getUser(userId)
      .then(function(user) {
        var returnData = result;
        if(user != false) {
          user.setSession(response.session);
          returnData = {txn: true, user: user.filter()};
        }
        return returnData;
      });
    }
    else {
      return result;
    }
  };

  auth_Helper.getSession = function(sid) {
    return session_Model.findOne({where:{sid: sid}});
  };

  auth_Helper.comparePassword = function(password, user) {
    var that = this;
    var resultData = {txn: false, err: login_Lang.wrongPassword};
    if(user) {
      return result = bcrypt.compareAsync(password, user.get('password'))
      .then(function(res) {
        var returnData = {};
        if(res === true) {
          returnData = {txn: true, user: user};
        }
        else {
          returnData = resultData;
        }
        return returnData;
      });
    }
    return resultData;
  };

  auth_Helper.checkToken = function(sid, token) {
    var result = {txn: false};
    return session_Model.findOne({where:{sid: sid}})
    .then(function(session) {
      if(session) {
        var sessionData = JSON.parse(session.get('data'));
        var txn = (sessionData.token === token);
        result = {txn: txn, token: sessionData.token};
      }
      return result;
    });
  };

  auth_Helper.buildToken = function(user) {
    var username = user.get('username');
    var id = user.get('id');
    var password = user.get('password');
    var rawToken = '{"username":"'+username+'","id":"'+id+'","password":"'+password+'"}';
    var cipher = crypto.createCipher('aes256', sec);
    return cipher.update(rawToken, "binary", "hex") + cipher.final("hex");
  };

  auth_Helper.decodeToken = function(token) {
    var decipher = crypto.createDecipher("aes256", sec);
    var decrypted = decipher.update(token, "hex", "binary") + decipher.final("binary");
    return JSON.parse(decrypted);
  };
  return auth_Helper;
}