var Promise = require('bluebird');

module.exports = function () {
  var general_Helper = {};

  general_Helper.getGenericPromise = function(data) {
    return new Promise(function(resolve) {
      resolve(data);
    });
  };

  general_Helper.getErrorMessagePromise = function(err) {
    return new Promise(function(resolve) {
      resolve({txn: false, err: err});
    });
  };

  general_Helper.getStatusCode = function(route, method, response) {
    return status_code_Lang[route][method][(response.txn)?'success':'fail'];;
  };

  general_Helper.getSQLError = function(route, method, errno) {
    return sql_error_Lang[route][method][errno];
  };

  return general_Helper;
}