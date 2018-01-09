const fs = require('fs');
const moment = require('moment');
var now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
var createDirectory = () => {
  var CurrentDate = moment(new Date()).format("DD-MM-YYYY");
  var tracePath = `./logs/${CurrentDate}`
  try{
     fs.mkdirSync( tracePath );

  }catch( err ){
    if(err.code === 'EEXIST'){
    }else{
       console.log( err );
    }
  }
  return tracePath
}
var logServer = ( message ) => {
  var logPath = createDirectory()
  var log = `${now}:${message}`;
  fs.appendFile(`${logPath}/server.log`, log + '\n', (err) => {
    if(err){
      console.log('Unable to append server.log');
    }
  });
};

var logAuth = ( message ) => {
  var logPath = createDirectory()
  var log = `${now}:${message}`;
  fs.appendFile(`${logPath}/auth.log`, log + '\n', (err) => {
    if(err){
      console.log('Unable to append auth.log');
    }
  });
};
var logDBMysql = ( message ) => {
  var logPath = createDirectory()
  var log = `${now}:${message}`;
  fs.appendFile(`${logPath}/mysql.log`, log + '\n', (err) => {
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
