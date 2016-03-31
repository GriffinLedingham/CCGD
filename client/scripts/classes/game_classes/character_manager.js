function CharacterManager() {};

CharacterManager.game = null;

CharacterManager.prototype.init = function(game){
  this.game_parent = game;
  this.game = game.instance;
};

CharacterManager.prototype.loadCharacter = function(data){
  var player = new Player();
  player.init(data, this.game_parent, false);
};

CharacterManager.prototype.loadNetworkedCharacter = function(data){
  var player = new Player();
  player.init(data, this.game_parent, true);
};

global.CharacterManager = module.exports = CharacterManager;