var config = require('../config/model_config');

module.exports = function (db, store) {
  var models = {session: store.Session};
  for(index in config.modelFiles) {
    models[config.modelFiles[index]] = require("./"+config.modelFiles[index]+"_model")(db, store);
  };

  for(key in models) {
    if ("associate" in models[key]) {
      models[key].associate();
      global[key + '_Model'] = module.exports = models[key];
    }
  }

  global['session_Model'] = module.exports = models['session'];

  db.sync({force: config.forceSync});
};