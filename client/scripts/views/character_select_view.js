function CharacterSelectView() {};

CharacterSelectView.dom_id    = '#character_select_menu';

CharacterSelectView.prototype.render = function(data){
  $('#interface').html(Framework.loadTemplate('characterSelectMenu'));
  this.setupBindings();
  getCharacterList();
};

CharacterSelectView.prototype.destroy = function(){
  this.destroyBindings();
  $(CharacterSelectView.dom_id).remove();
};

CharacterSelectView.prototype.setupBindings = function(){
  var that = this;
  var socket = SocketManager.getSocket();

  this.setupBinding({
    parent:   $(document),
    key:      'click',
    element:  '#create_character',
    callback: function(e){
      $('#interface').prepend(Framework.loadTemplate('characterCreateMenu'));
      $('#confirm_create_character').on('click',function(){
        $('#confirm_create_character').off('click');
        socket.emit('create_character',{
          name: $('#character_name_input').val()
        });
        $('#character_create_menu').remove();
      });
    }
  });

  this.setupBinding({
    parent:   socket,
    key:      'character_select_callback',
    callback: function(data){
      $('#interface').html(Framework.loadTemplate('characterSelectMenu', data));
    }
  });

  this.setupBinding({
    parent:   socket,
    key:      'character_data_callback',
    callback: function(data){
      EventManager.emit('load_game', data);
      that.destroy();
    }
  });

  this.setupBinding({
    parent:   $(document),
    key:      'click',
    element:  '.character-select-item',
    callback: function(e){
      socket.emit('get_character', {characterId: $(e.currentTarget).data('c_id')});
    }
  });
};

var getCharacterList = function(){
  var socket = SocketManager.getSocket();
  socket.emit('get_character_list');
};

global.CharacterSelectView = module.exports = CharacterSelectView;