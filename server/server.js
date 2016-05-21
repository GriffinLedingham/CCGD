var Promise       = require('bluebird');
var express       = require('express');
var cookieParser  = require('cookie-parser');
var bodyParser    = require("body-parser");
var session       = Promise.promisifyAll(require('express-session'));
var Store         = require('express-sequelize-session')(session.Store);
var app           = express();
var http          = require('http').Server(app);
var assert        = require('assert');
var Sequelize     = require('sequelize');
var _             = require('lodash');

var sequelize = new Sequelize('dungeon', 'root', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

var store = new Store(sequelize);

app.use(express.static('www'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser())
app.use(session({
  secret: 'thi$i$mysecr3t',
  resave:false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 86400000,
    expires: 86400000
  }
}));
http.listen(3000);

var language = require('./language')();
var models   = require('./models')(sequelize, store);
var helpers  = require('./helpers')();
var routes   = require('./routes')(app);

global.Map = module.exports = require('./classes/map.js');
global.MapManager = module.exports = new require('./classes/map_manager.js');
MapManager.init();

var User          = require('./classes/user.js');

global.io         = require('socket.io')(http);

io.on('connection', function(socket){
  var user = new User();
  user.init(socket);
});

console.log('Server started.')
