function App() {};

App.prototype.init = function(id){
  this.instance = new Phaser.Game( 1024, 768, Phaser.AUTO, id, {
      preload: this.preload,
      create: this.create,
      update: this.update,
      render: this.render
  });
};

global.App = module.exports = App;