const moment = require('moment');
const log = require('./../../utils/log.js');
const pool = require('./../../database/mysql/connection.js');

var now =  moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

var dbName = pool.databaseName(function(result) {
    //
});

module.exports.validateUser = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" validate User called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      var query = 'SELECT * FROM  ' + dbName + '.lend_user_info WHERE mobileNo = TRIM( ? ) OR emailAddr = TRIM( ?) OR deviceToken = TRIM( ?) OR deviceId = TRIM( ?)';
      connection.query( query,[ request.userInfo.mobileNo, request.userInfo.emailAddr, request.deviceInfo.deviceToken, request.deviceInfo.deviceId],function(err,rows){
          log.logDBMysql( " Releasing Database Connection ", rows);
          connection.release();
          if(!err) {
              log.logDBMysql( " sucessfully fetched rows : ", rows);
              resolve( rows );
          }else{
            log.logDBMysql( `failed fetched rows :  ${err.message}`);
            reject( "0104" );
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});

}

module.exports.validateUserLogin = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" validate validateUserLogin called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      var query = "SELECT * FROM  " + dbName + ".lend_user_info WHERE mobileNo = TRIM( ? ) AND password = TRIM( ? )";
      connection.query( query,[ request.userInfo.mobileNo, request.userInfo.password],function(err,rows){
          log.logDBMysql( " Releasing Database Connection ", rows);
          connection.release();
          if(!err) {
            log.logDBMysql( " sucessfully fetched rows validateUserLogin() : ", rows);
            resolve( rows );

          }else{
            log.logDBMysql( `failed to fetch rows for validateUserLogin() :  ${err.message}`);
            reject( "0107" );
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
      var query = "INSERT INTO  " + dbName + ".lend_user_info ( mobileNo, emailAddr, password, deviceId, deviceToken, deviceType, firstLogin, deviceModel ) VALUES ( TRIM( ? ), TRIM( ?), TRIM( ? ),TRIM( ?), TRIM( ? ), TRIM( ?), TRIM( ? ), TRIM( ? ))";
      connection.query( query,[request.userInfo.mobileNo, request.userInfo.emailAddr, request.userInfo.password, request.deviceInfo.deviceId, request.deviceInfo.deviceToken, request.deviceInfo.deviceType, "001", request.deviceInfo.deviceModel],function(err,rows){
          log.logDBMysql( " Releasing Database Connection ", rows);
          connection.release();
          if(!err) {
              console.log(" sucessfully inserted row : ", rows);
              log.logDBMysql( " sucessfully inserted row : ", rows);
              resolve( rows );
          }else{
              log.logDBMysql( ` failed to inserted row : ${err}` );
              reject( "0105" );

          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});
}
module.exports.insertBidRequest = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" insertBidRequest() called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      var query = "INSERT INTO  " + dbName + ".lend_bid_request_info ( requestId, userId, image, bidPrice, bidCurrency, type, period, deposit, requiredDoc, note, bidLat, bidLong, status ) VALUES ( TRIM( ? ), TRIM( ?), TRIM( ? ),TRIM( ?), TRIM( ? ), TRIM( ?), TRIM( ? ), TRIM( ? ), TRIM( ?), TRIM( ? ),TRIM( ?), TRIM( ? ), TRIM( ?))";
      connection.query( query,[request.bidInfo.requestId, request.userInfo.userId, request.bidInfo.image, request.bidInfo.bidAmount, request.bidInfo.bidCurrency, request.bidInfo.type, request.bidInfo.period, request.bidInfo.deposit, request.bidInfo.requiredDoc, request.bidInfo.note, request.locationInfo.latitude, request.locationInfo.longitude, "001" ],function(err,rows){
          log.logDBMysql( " Releasing Database Connection ", rows);
          connection.release();
          if(!err) {
              console.log(" sucessfully inserted insertBidRequest() : ", rows);
              log.logDBMysql( " sucessfully inserted  insertBidRequest() : ", rows);
              resolve( rows );
          }else{
              log.logDBMysql( ` failed to inserted row : ${err}` );
              reject( "0117" );

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
      var query = "INSERT INTO " + dbName + ".lend_user_location_info (userId, latitude, longitude) VALUES ( TRIM(?), TRIM(?), TRIM(?))";
      connection.query( query, [ request.userInfo.userId, request.locationInfo.latitude, request.locationInfo.longitude],function(err,rows){
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
      log.logDBMysql('UPDATING record for userId ' + request.userInfo.userId );
      var query = 'UPDATE  ' + dbName + '.lend_user_location_info SET latitude = TRIM(?), longitude = TRIM(?)  WHERE userId = TRIM(?)';
      connection.query( query, [ request.locationInfo.latitude , request.locationInfo.longitude ,request.userInfo.userId], function(err,rows){
          log.logDBMysql( " Releasing Database Connection ", rows);
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

module.exports.insertUserKYC = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" insertUserKYC() called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      var query = "INSERT INTO  " + dbName + ".lend_user_kyc_info (userId, firstName, lastName, sex, dob, idProof, idProofDesc) VALUES ( TRIM(?), TRIM(?), TRIM(?), TRIM(?), TRIM(?), TRIM(?), TRIM(?) )";
      connection.query( query, [ request.userInfo.userId, request.userInfo.firstName, request.userInfo.lastName, request.userInfo.sex, request.userInfo.dob, request.userInfo.idProof, request.userInfo.idProofDesc ],function(err,rows){
          log.logDBMysql( " Releasing Database Connection ", rows);
          connection.release();
          if(!err) {
              log.logDBMysql( " sucessfully inserted insertUserKYC() record : " + rows);
              resolve( rows );
          }else{
              log.logDBMysql( " failed to insert insertUserKYC() : " + err);
              reject("0110");
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});
}

module.exports.updateUserKYC = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" updateUserLocation called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      log.logDBMysql('UPDATING record for userId ' + request.userInfo.userId );
      var query = 'UPDATE  ' + dbName + '.lend_user_kyc_info SET firstName = TRIM(?), lastName = TRIM(?), middleName = TRIM(?),sex = TRIM(?), dob = TRIM(?), idProof = Trim(?), idProofDesc = Trim(?)  WHERE userId = TRIM(?)';
      connection.query( query, [ request.userInfo.firstName , request.userInfo.lastName , request.userInfo.middleName ,request.userInfo.sex, request.userInfo.dob, request.userInfo.idProof, request.userInfo.idProofDesc, request.userInfo.userId], function(err,rows){
          log.logDBMysql( " Releasing Database Connection ", rows);
          connection.release();
          if(!err) {
              log.logDBMysql( " sucessfully updated updateUserKYC() record : " + rows);
              resolve( rows );
          }else{
              log.logDBMysql( " failed to updat updateUserKYC() record  : " + err);
              reject( "0109" );
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});
}


module.exports.updateLoginInfo = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" updateLoginInfo called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      log.logDBMysql('UPDATING record for userId ' + JSON.stringify(request) );
      var query = 'UPDATE  ' + dbName + '.lend_user_info SET lastLogin = TRIM(?) WHERE userId = TRIM(?)';
      connection.query( query, [ now ,request[0].userId], function(err,rows){
          log.logDBMysql( " Releasing Database Connection ", rows);
          connection.release();
          if(!err) {
              log.logDBMysql( " sucessfully updated LastLogin() : " + rows);
              resolve( rows );
          }else{
              log.logDBMysql( " failed to update LastLogin() : " + err);
              reject( "0108" )
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});
}

module.exports.updateDeviceInfo = ( request, loginUser ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" updateDeviceInfo called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      log.logDBMysql('UPDATING record for userId ' + JSON.stringify(request) );
      var query = 'UPDATE  ' + dbName + '.lend_user_info SET deviceId = TRIM(?), deviceType = TRIM(?), deviceToken = TRIM(?), deviceModel = TRIM( ? ) WHERE userId = TRIM(?)';
      connection.query( query, [ request.deviceInfo.deviceId, request.deviceInfo.deviceType, request.deviceInfo.deviceToken, request.deviceInfo.deviceModel , loginUser[0].userId], function(err,rows){
          log.logDBMysql( " Releasing Database Connection ", rows);
          connection.release();
          if(!err) {
              log.logDBMysql( " sucessfully updated LastLogin() : " + rows);
              resolve( rows );
          }else{
              log.logDBMysql( " failed to update LastLogin() : " + err);
              reject( "0108" )
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});
}


module.exports.updateDeviceInfo2 = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" updateDeviceInfo2 called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      log.logDBMysql('UPDATING record for userId ' + JSON.stringify(request) );
      var query = 'UPDATE  ' + dbName + '.lend_user_info SET deviceId = TRIM(?), deviceType = TRIM(?), deviceToken = TRIM(?), deviceModel = TRIM( ? ) WHERE userId = TRIM(?)';
      connection.query( query, [ request.deviceInfo.deviceId, request.deviceInfo.deviceType, request.deviceInfo.deviceToken, request.deviceInfo.deviceModel , request.userInfo.userId], function(err,rows){
          log.logDBMysql( " Releasing Database Connection ", rows);
          connection.release();
          if(!err) {
              log.logDBMysql( " sucessfully updated updateDeviceInfo2() : " + rows);
              resolve( rows );
          }else{
              log.logDBMysql( " failed to update updateDeviceInfo2() : " + err);
              reject( "0108" )
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});
}

module.exports.insertBorrowRequest = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql(" insertBorrowRequest() called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      var query = "INSERT INTO lend_database.lend_borrow_request_info ( image, category, brand, bidRange, type, period, note, borrowDesc, bidCurrency, borrowUserId, status, borrowLat, borrowLong ) VALUES ( TRIM(?), TRIM(?), TRIM(?), TRIM(?), TRIM(?), TRIM(?), TRIM(?), TRIM(?), TRIM(?), TRIM(?), TRIM(?), TRIM(?), TRIM(?) )";
      connection.query( query, [ request.borrowInfo.image, request.borrowInfo.category, request.borrowInfo.brand, request.borrowInfo.bidRange, request.borrowInfo.type,  request.borrowInfo.period,  request.borrowInfo.note,  request.borrowInfo.borrowDesc, request.borrowInfo.bidCurrency, request.userInfo.userId, "001", request.locationInfo.latitude, request.locationInfo.longitude ],function(err,rows){
          log.logDBMysql( " Releasing Database Connection ", rows);
          connection.release();
          if(!err) {
              log.logDBMysql( " sucessfully inserted insertBorrowRequest() record : " + rows);
              resolve( rows );
          }else{
              log.logDBMysql( " failed to insert insertBorrowRequest() : " + err);
              reject("0111");
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});
}
module.exports.fetchUserInfo = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql("fetchUserInfo called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      var query = "SELECT * FROM lend_database.lend_user_info WHERE userId = TRIM( ? )";
      connection.query( query,[ request.userId ],function(err,rows){
          log.logDBMysql( " Relesing Database Connection " + rows);
          connection.release();
          if(!err) {
            log.logDBMysql( " sucessfully fetched rows fetchUserInfo() : " + rows);
            resolve( rows );

          }else{
            log.logDBMysql( `failed to fetch rows for fetchUserInfo() :  ${err.message}`);
            reject( "0112" );
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});

}

module.exports.fetchLocationInfo = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql("fetchLocationInfo called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      var query = "SELECT * FROM lend_database.lend_user_location_info WHERE userId = TRIM( ? )";
      connection.query( query,[ request.userInfo.userId ],function(err,rows){
          log.logDBMysql( " Relesing Database Connection " + rows);
          connection.release();
          if(!err) {
            log.logDBMysql( " sucessfully fetched rows fetchLocationInfo() : " + JSON.stringify(rows));
            resolve( rows );

          }else{
            log.logDBMysql( `failed to fetch rows for fetchLocationInfo() :  ${err.message}`);
            reject( "0113" );
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});

}
module.exports.fetchNearbyUsers = ( request ) => {
return new Promise( (resolve, reject) => {
  log.logDBMysql("fetchNearbyUsers called successfully");
  pool.getConnection(function(err,connection){
      if (err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      }
      log.logDBMysql('connected as id ' + connection.threadId );
      log.logDBMysql( ` request passing db : ${JSON.stringify(request)}`   );
      console.log( ` request passing db : ${JSON.stringify(request)}`   );
      console.log( request);

      var query = "SELECT * ,(((acos(sin((TRIM( ? )*pi()/180)) * sin((latitude*pi()/180))+cos(((TRIM(?))*pi()/180)) * cos(( latitude*pi()/180)) * cos(((TRIM( ? )- longitude)*pi()/180))))*180/pi())*60*1.1515*1.609344) as distance FROM lend_database.lend_user_location_info HAVING distance <= TRIM(?)";
      connection.query( query,[ request.latitude, request.latitude,request.longitude, request.radius ],function(err,rows){

          log.logDBMysql( " Relesing Database Connection " + rows);
          connection.release();
          if(!err) {
            log.logDBMysql( " sucessfully fetched rows fetchNearbyUsers() : " + JSON.stringify(rows));
            resolve( rows );

          }else{
            log.logDBMysql( `failed to fetch rows for fetchNearbyUsers() :  ${err.message}`);
            reject( "0114" );
          }
      });

      connection.on('error', function(err) {
        log.logDBMysql( "Error in connection database");
        reject ( "0100" );
      });
});
});

}
