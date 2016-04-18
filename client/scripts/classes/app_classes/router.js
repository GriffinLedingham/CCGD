var Router = {};

Router.currentView = null;

Router.destroyView = function(key, data) {
  if(this.currentView != null) {
    this.currentView.destroy();
  }
};

Router.loadView = function(key, data, teardown){
  if(typeof data == 'undefined') data = {};
  if(this.currentView != null && teardown) {
    this.currentView.destroy();
  }

  var baseView = new BaseView();
  var newView = new window[key[0].toUpperCase() + key.slice(1) + 'View'];

  for(prop_id in newView) {
    baseView[prop_id] = newView[prop_id];
  };

  this.currentView = baseView;

  if(typeof this.currentView.init != 'undefined') {
    this.currentView.init(data)
    this.currentView.render(data);
  }
  else if(typeof this.currentView.render != 'undefined') {
    this.currentView.render(data);
  }
};

global.Router = module.exports = Router;