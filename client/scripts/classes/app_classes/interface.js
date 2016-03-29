var Interface = {};

Interface.renderMenu = function(){
  $('#interface').html(Framework.loadTemplate('mainMenu'));
};

Interface.displayError = function(data){
  $('#interface').prepend(Framework.loadTemplate('errorModal', data));
  $('#error_wrapper').on('click',function(){
    $('#error_wrapper').remove();
    $('#error_wrapper').off('click');
  });
};

global.Interface = module.exports = Interface;