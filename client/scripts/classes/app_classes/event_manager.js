var EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();
EventManager = {};
EventManager.listeners = {};

EventManager.on = function(key, unique_id, callback){
  emitter.addListener(key, callback);
  if(typeof this.listeners[key] == 'undefined'){
    this.listeners[key] = {};
    this.listeners[key][unique_id] = callback;
  }
  else{
    this.listeners[key][unique_id] = callback;
  }
};

EventManager.emit = function(key, data){
  console.log('EventEmitter::Emit - Sending Event ' + key);
  if(typeof data == 'undefined') data = {};
  emitter.emit(key, data);
};

EventManager.off = function(key, unique_id){
  emitter.removeListener(key, this.listeners[key][unique_id]);
};

global.EventManager = module.exports = EventManager;