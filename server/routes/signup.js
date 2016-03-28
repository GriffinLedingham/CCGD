var express = require('express');
var Promise = require('bluebird');

module.exports = function () {
  var routes = express.Router();
  routes.post('/',function(req,res) {
    auth_Helper.signupUser(req.body.username,req.body.password, req.body.email).then(function(response){
      res.status(general_Helper.getStatusCode('signup', 'post', response)).send(response);
      res.end();
    });
  });
  return routes;
};
