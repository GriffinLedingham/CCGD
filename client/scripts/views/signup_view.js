function SignupView() {};

SignupView.dom_id    = '#signup_menu';

SignupView.prototype.render = function(){
  $('#interface').html(Framework.loadTemplate('signupMenu'));
  this.setupBindings();
};

SignupView.prototype.destroy = function(){
  this.destroyBindings();
  $(SignupView.dom_id).remove();
};

SignupView.prototype.setupBindings = function(){
  var socket = SocketManager.getSocket();

  this.setupBinding({
    parent:   $('.signup-control'),
    key:      'keypress',
    callback: function(e){
      if(e.which == 13) {
        $('.signup-control').blur();
        socket.emit('signup_post',{
          username: $('#username_input').val(),
          password: $('#password_input').val(),
        });
      }
    }
  });

  this.setupBinding({
    parent:   $('#signup_button'),
    key:      'click',
    callback: function(e){
      socket.emit('signup_post',{
        username: $('#username_input').val(),
        password: $('#password_input').val(),
      });
    }
  });
};

global.SignupView = module.exports = SignupView;