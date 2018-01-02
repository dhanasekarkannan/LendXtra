const mysql = require('mysql');
const moment = require('moment');
const log = require('./../../utils/log.js');

const pool = mysql.createPool({
    connectionLimit : 100,
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'lend_database',
    debug : false
})

var now =  moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

module.exports.validateUser = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" validate User called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      var query = "SELECT * FROM lend_database.lend_user_info WHERE username = '" +request.userInfo.username + "' OR mobile_no = '" +request.userInfo.username + "' OR email_id = '" +request.userInfo.username + "' OR userid = '" +request.userInfo.username + "'"
      connection.query( query,function(err,rows){
          log.logDBMysql( " Relesing Database Connection ", rows);
          connection.release();
          if(!err) {
              log.logDBMysql( " sucessfully fetched rows : ", rows);
              resolve( rows );
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});

}

module.exports.validateUserName = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" validate User called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      var query = "SELECT * FROM lend_database.lend_user_info WHERE username = '" + request.userInfo.username + "'";
      connection.query( query,function(err,rows){
          log.logDBMysql( " Relesing Database Connection ", rows);
          connection.release();
          if(!err) {
              log.logDBMysql( " sucessfully fetched rows : ", rows);
              resolve( rows );
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});

}
module.exports.insertUserLoginReg = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" Insert User called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      var now =  moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      var query = "INSERT INTO lend_database.lend_user_info (userid, username, mobile_no, email_id, password,regTime) VALUES ('" + request.userInfo.username + " ', '" + request.userInfo.username +  " ', '" + request.userInfo.mobileNo +  " ', '" + request.userInfo.emailId + " ', '" + request.userInfo.password +  " ', '" + now + "')";
      connection.query( query,function(err,rows){
          log.logDBMysql( " Relesing Database Connection ", rows);
          connection.release();
          if(!err) {
              log.logDBMysql( " sucessfully inserted row : ", rows);
              resolve( rows );
          }else{
              log.logDBMysql( " failed to inserted row : ", err);
              console.log( "failed to inserted row : ", err)
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});
}

module.exports.insertUserLocationInfo = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" Insert User called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      var query = "INSERT INTO lend_database.lend_user_location_info (userid, latitude, longitude, lastUpdate) VALUES ( TRIM(?), TRIM(?), TRIM(?), TRIM(?) )";
      connection.query( query, [ request.userInfo.username, request.locationInfo.latitude, request.locationInfo.longitude, now ],function(err,rows){
          log.logDBMysql( " Relesing Database Connection ", rows);
          connection.release();
          if(!err) {
              log.logDBMysql( " sucessfully inserted row : ", rows);
              resolve( rows );
          }else{
              log.logDBMysql( " failed to inserted row : ", err);
              console.log( "failed to inserted row : ", err)
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});
}

module.exports.updateUserLocation = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" updateUserLocation called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      log.logDBMysql('UPDATING record for userid ' + request.userInfo.username );
      var query = 'UPDATE lend_database.lend_user_location_info SET latitude = TRIM(?), longitude = TRIM(?), lastUpdate = TRIM(?)  WHERE userid = TRIM(?)';
      connection.query( query, [ request.locationInfo.latitude , request.locationInfo.longitude , now ,request.userInfo.username], function(err,rows){
          log.logDBMysql( " Relesing Database Connection ", rows);
          connection.release();
          if(!err) {
              log.logDBMysql( " sucessfully updated row : ", rows);
              resolve( rows );
          }else{
              log.logDBMysql( " failed to updated row : ", err);
              console.log( "failed to updated row : ", err)
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});
}
