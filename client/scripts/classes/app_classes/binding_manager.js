var BindingManager = {};

BindingManager.setupBinding = function(data){
  var parent = data.parent;
  var key = data.key;
  var callback = data.callback;
  var element = null;
  if(typeof data.element != 'undefined') {
    element = data.element;
    parent.on(key, element, callback);
  }
  else {
    parent.on(key, callback);
  }
  return {parent:parent,key:key};
};

BindingManager.destroyBinding = function(data){
  var parent = data.parent;
  var key = data.key;
  var element = null
  if(typeof data.element != 'undefined'){
    element = data.element;
  }

  if(typeof parent.off != 'undefined') {
    if(element != null) {
      parent.off(key, element);
    }
    else{
      parent.off(key);
    }
  }
  else {
    parent.removeListener(key);
  }
};

global.BindingManager = module.exports = BindingManager;