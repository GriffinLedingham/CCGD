function BaseView() {};

BaseView.bindings  = [];

BaseView.prototype.setupBinding = function(data){
  BaseView.bindings.push(BindingManager.setupBinding(data));
};

BaseView.prototype.destroyBindings = function(){
  for(var i = BaseView.bindings.length - 1;i>=0;i--) {
    var binding = BaseView.bindings[i];
    BindingManager.destroyBinding(binding);
    BaseView.bindings.splice(i, 1);
  }
};

global.BaseView = module.exports = BaseView;