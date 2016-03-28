(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
function Game() {};

Game.prototype.init = function(id){
  this.instance = new Phaser.Game( 1024, 768, Phaser.AUTO, id, {
      preload: this.preload,
      create: this.create,
      update: this.update,
      render: this.render
  });
};

Game.prototype.preload = function(){

};

Game.prototype.create = function(){

};

Game.prototype.update = function(){

};

Game.prototype.render = function(){

};

global.Game = module.exports = Game;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
var Framework = function(){
  this.initTemplates = function(){
    $.ajax({
      url: '/templates/template.html',
      type: 'GET',
      async: false,
      complete: function(response) {
        $('#templates').append(response.responseText);
      }
    });
  };

  this.loadTemplate = function(key, vars){
    if(typeof vars == 'undefined') { vars = {}; }
    var temp = Handlebars.compile($('#'+key).html());
    return temp(vars);
  };

  this.init = function(){
    this.initTemplates();
  };
};

global.Framework = module.exports = new Framework();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
var framework = require('./framework');

var init = function() {
  framework.loadTemplate('helloTemplate');
};
},{"./framework":2}]},{},[1,2,3]);
