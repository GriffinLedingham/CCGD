var config = require('../config/helper_config');

module.exports = function () {
  for(index in config.helperFiles) {
    global[config.helperFiles[index]+'_Helper'] = module.exports = new require("./"+config.helperFiles[index]+"_helper")();
  };
};