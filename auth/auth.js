const fs = require('fs');
const utils = require('../utils/utils.js');
const db = require('../database/mysql/mysql.js');
const log = require('../utils/log.js');


module.exports.vaidateAppVersion = ( request ) =>{
  log.logAuth('Receiving request from server : ' + JSON.stringify(request) );
  log.logAuth(`Validating AppVersion ( ${request.deviceInfo.OS} ) on config ` );
  var response = utils.validateAppVersion(request.deviceInfo.OS, request.deviceInfo.appVersion);
  if( typeof (response) === "object" ){
    log.logAuth(`validateAppVersion() success for OS(${request.deviceInfo.OS}) and version (${request.deviceInfo.appVersion})` )
    return generateGoodResponse( response, `${request.deviceInfo.OS} App found in server` );
  }else{
    log.logAuth(`validateAppVersion() failed for OS(${request.deviceInfo.OS}) and version (${request.deviceInfo.appVersion})` )
    log.logAuth( `${response} - for bad response `)
    return generateBadResponse( response );
  }
}

module.exports.userLogin = ( request  ) => {
  return new Promise( (resolve, reject ) => {
    log.logAuth('Receiving request from server : ' + JSON.stringify(request) );
    log.logAuth(`validateUserLogin ( ${request.userInfo.username} ) on lend_user_info table ` );
    db.validateUser( request ).then(( rows ) => {
      log.logAuth(`validateUserLogin() success for username - (${request.userInfo.username}) ` );
      log.logAuth(`${rows} - for good response `);
      var numRows = rows.length;
      if( numRows !== 0 ){
        resolve( generateGoodResponse( rows ) );
        // return resolve( generateGoodResponse( rows ) );
      }else{
        reject( generateBadResponse( err ));
      }
    }).then( ( rows )  => {
      // <! -  return menus for login >
      // log.logAuth(`validateRows() success for username - (${request.userInfo.username}) ` );
      // log.logAuth(`${rows} - for good response `);
      // resolve( generateGoodResponse( rows ) );
    }).catch((err) => {
      log.logAuth(`validateUserLogin() failed for username - (${request.userInfo.username}) ` )
      reject( generateBadResponse( err ));
    });
  });
}

module.exports.userRegistration = ( request  ) => {
  return new Promise( (resolve, reject ) => {
    log.logAuth('Receiving request from server : ' + JSON.stringify(request) );
    log.logAuth(`userRegistration ( ${request.userInfo.username} ) on lend_user_info table ` );
    db.validateUser( request ).then(( rows ) => {
      log.logAuth(`validateUser() success for username - (${request.userInfo.username}) ` );
      var numRows = rows.length;
      log.logAuth(`${numRows} - rows for good response `);
      if( numRows === 0 ){
        return db.insertUserLoginReg( request )
      }else{
        throw new Error( "0101" );
      }
    }).then( (result) => {
      log.logAuth(`insertUserLoginReg() success for username - (${request.userInfo.username}) ` );
      log.logAuth(`${result} - for good response `);
      resolve( generateGoodResponse( result ) );
    }).catch( (err) => {
      log.logAuth(`userRegistration() failed for username - (${request.userInfo.username}) ` )
      log.logAuth( `${err.message} - for bad response `)
      reject( generateBadResponse( err.message ));
    });
  });
}

module.exports.updateUserLocation = ( request  ) => {
  return new Promise( (resolve, reject ) => {
    log.logAuth('Receiving request from server : ' + JSON.stringify(request) );
    log.logAuth(`updateUserLocation ( ${request.userInfo.username} ) on lend_user_location_info table ` );
    db.updateUserLocation( request ).then(( rows ) => {
      log.logAuth(`updateUserLocation() success for username - (${request.userInfo.username}) ` );
      log.logAuth(`${rows.affectedRows} - for good response `);
      var numRows = rows.affectedRows;
      if( numRows !== 0 ){
        resolve( generateGoodResponse( rows ) );
      }else{
        return db.insertUserLocationInfo( request );
      }
    }, ( error ) => {
      log.logAuth(`updateUserLocation() failed for username - (${request.userInfo.username}) ` )
      reject( generateBadResponse( err.message ));
    }).then( ( rows )  => {
      log.logAuth(`insertUserLocationInfo() success for username - (${request.userInfo.username}) ` );
      log.logAuth(`${rows} - for good response `);
      resolve( generateGoodResponse( rows ) );
    },( error ) => {
      log.logAuth(`insertUserLocationInfo() failed for username - (${request.userInfo.username}) ` )
      reject( generateBadResponse( err.message ));
    } );
  });
}

var generateGoodResponse = ( body ) => {
  log.logAuth( 'Generating Good Response ...' );
  var response  = {
    responseCode : 0,
    body : body
  }
  logResponse( 'Sending Good Response to server : '  , response )
  logResponse( 'Sending Good Response type server : '  , typeof response )
  return response
}

var generateBadResponse = ( errCode ) => {
  log.logAuth( 'Generating Bad Response ... errCode:', errCode );
  var errorBody = utils.getErrorDesc( errCode );
  var response = {
    responseCode : 1,
    error : errorBody
  }
  logResponse( 'Sending Bad Response to server : '  , response );
  return response;
}

var logResponse = ( message, response ) => {
  var responseString = JSON.stringify(response);
  log.logAuth( message + `${responseString}` );
}
