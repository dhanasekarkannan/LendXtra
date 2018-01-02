const fs = require('fs');

var logServer = ( message ) => {
  var now = new Date().toString();
  var log = `${now}:${message}`;
  fs.appendFile('logs/server.log', log + '\n', (err) => {
    if(err){
      console.log('Unable to append server.log');
    }
  });
};

var logAuth = ( message ) => {
  var now = new Date().toString();
  var log = `${now}:${message}`;
  fs.appendFile('logs/auth.log', log + '\n', (err) => {
    if(err){
      console.log('Unable to append auth.log');
    }
  });
};
var logDBMysql = ( message ) => {
  var now = new Date().toString();
  var log = `${now}:${message}`;
  fs.appendFile('logs/mysql.log', log + '\n', (err) => {
    if(err){
      console.log('Unable to append auth.log');
    }
  });
};

module.exports = {
  logServer,
  logAuth,
  logDBMysql
};
