function LoginView() {};

LoginView.dom_id    = '#login_menu';

LoginView.prototype.render = function(){
  $('#interface').html(Framework.loadTemplate('loginMenu'));
  this.setupBindings();
};

LoginView.prototype.destroy = function(){
  this.destroyBindings();
  $(LoginView.dom_id).remove();
};

LoginView.prototype.setupBindings = function(){
  var socket = SocketManager.getSocket();

  this.setupBinding({
    parent:   socket,
    key:      'login_callback',
    callback: function(data){
      if(data.txn) { Router.loadView('CharacterSelect', data, true); }
      else { Interface.displayError(data); }
    }
  });

  this.setupBinding({
    parent:   $('.login-control'),
    key:      'keypress',
    callback: function(e){
      if(e.which == 13) {
        $('.login-control').blur();
        socket.emit('login_post',{
          username: $('#username_input').val(),
          password: $('#password_input').val(),
        });
      }
    }
  });

  this.setupBinding({
    parent:   $('#login_button'),
    key:      'click',
    callback: function(e){
      socket.emit('login_post',{
        username: $('#username_input').val(),
        password: $('#password_input').val(),
      });
    }
  });
};

global.LoginView = module.exports = LoginView;