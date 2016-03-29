var SocketManager = {};

SocketManager.init = function(){
  this.socket = io();
}

SocketManager.getSocket = function(){
  return this.socket;
};

global.SocketManager = module.exports = SocketManager;