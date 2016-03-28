var express = require('express');

module.exports = function () {
  var routes = express.Router();
  routes.post('/session',function(req,res){
    var result = false;
    res.send(result);
    res.end();
  });

  routes.post('/user', function(req,res) {
    user_Model.getUser(1).then(function(result){
      res.send(result);
      res.end();
    });
  });
  return routes;
};
