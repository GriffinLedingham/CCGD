var express = require('express');
var Promise = require('bluebird');

module.exports = function () {
  var routes = express.Router();
  routes.get('/', function(req,res) {
    if(typeof req.session.token != 'undefined') {
      auth_Helper.checkToken(req.sessionID, req.session.token)
      .then(function(response){return auth_Helper.loginUserByToken(response)})
      .then(function(response) {
        res.status(general_Helper.getStatusCode('login','get',response)).send(response);
        res.end();
      });
    }
    else {
      res.status(general_Helper.getStatusCode('login','get',response)).send({txn: false});
      res.end();
    }
  });

  routes.post('/',function(req,res) {
    auth_Helper.loginUser(req.body.username,req.body.password)
    .then(function(response){
      if(response.txn) {
        req.session.token = auth_Helper.buildToken(response.user);
        req.session.saveAsync()
        .then(function(err){
          auth_Helper.getSession(req.sessionID).then(function(session) {
            response.user.setSession(session);
            response.user = response.user.filter();
            res.status(general_Helper.getStatusCode('login','post',response)).send(response);
            res.end();
          });
        });
      }
      else {
        res.status(general_Helper.getStatusCode('login','post',response)).send(response);
        res.end();
      }
    });
  });

  return routes;
};
