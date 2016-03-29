var Interface = {};

Interface.renderMenu = function(){
  $('#interface').html(Framework.loadTemplate('mainMenu'));
};

global.Interface = module.exports = Interface;