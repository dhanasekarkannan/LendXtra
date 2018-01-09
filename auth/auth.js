const fs = require('fs');
const utils = require('../utils/utils.js');
const db = require('../database/mysql/mysql.js');
const log = require('../utils/log.js');

var loginUser = [];

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
    log.logAuth(`validateUser ( ${request.userInfo.mobileNo} ) on lend_user_info table ` );
    db.validateUser( request ).then(( rows ) => {
      log.logAuth(`validateUser() success for MobileNo - (${request.userInfo.mobileNo}) ` );
      if( rows.length !== 0 ){
        return db.validateUserLogin( request );
      }else{
        reject( generateBadResponse( "0102" ));
      }
    }, (err) => {
      log.logAuth(`validateUser() failed for MobileNo - (${request.userInfo.mobileNo})` )
      reject( generateBadResponse( err ));
    }).then( ( rows )  => {
      log.logAuth(`validateUserLogin() sucess for MobileNo - (${request.userInfo.mobileNo}) & rows ${JSON.stringify(rows)}` )
      loginUser = rows
      if( rows.length !== 0 ){
        return db.updateLoginInfo(loginUser);
      }else{
        reject( generateBadResponse( "0106" ));
      }
    }, (err) => {
      log.logAuth(`validateUserLogin() failed for MobileNo - (${request.userInfo.mobileNo}) & error (${err} )` )
      reject( generateBadResponse( err ));
    }).then( ( rows )  => {
      log.logAuth(`updateLoginInfo() success for MobileNo - (${request.userInfo.mobileNo})  )` )
      return db.updateDeviceInfo( request, loginUser );
    }, (err) => {
      log.logAuth(`UpdateLastLogin() failed for MobileNo - (${request.userInfo.mobileNo}) & error (${err} )` )
      reject( generateBadResponse( err ));
    }).then( ( rows )  => {
      log.logAuth(`updateDeviceInfo() success for MobileNo - (${request.userInfo.mobileNo})  )` )
        resolve( generateGoodResponse( rows ));
    }, (err) => {
      log.logAuth(`updateDeviceInfo() failed for MobileNo - (${request.userInfo.mobileNo}) & error (${err} )` )
      reject( generateBadResponse( err ));
    });
  });
}

module.exports.userRegistration = ( request  ) => {
  return new Promise( (resolve, reject ) => {
    log.logAuth('Receiving request from server : ' + JSON.stringify(request) );
    log.logAuth(`userRegistration ( ${request.userInfo.mobileNo} ) on lend_user_info table ` );
    db.validateUser( request ).then(( rows ) => {
      log.logAuth(`validateUser() success for mobileNo - (${request.userInfo.mobileNo}) ` );
      if( rows.length === 0 ){
        return db.insertUserLoginReg( request );
      }else{
        reject( generateBadResponse( "0101" ));
      }
    }, (err) => {
      log.logAuth(`userRegistration() failed for mobileNo - (${request.userInfo.mobileNo}) ` )
      log.logAuth( `${err} - for bad response `)
      reject( generateBadResponse( err ));
    }).then( (result) => {
      log.logAuth(`insertUserLoginReg() success for mobileNo - (${request.userInfo.mobileNo}) ` );
      log.logAuth(`${result} - for good response `);
      resolve( generateGoodResponse( result ) );
    }, (err) => {
      log.logAuth(`insertUserLoginReg() failed for mobileNo - (${request.userInfo.mobileNo}) ` )
      log.logAuth( `${err} - for bad response `)
      reject( generateBadResponse( err ));
    });
  });
}

module.exports.updateDeviceInfo = ( request ) => {
    return new Promise((resolve, reject ) => {
      db.updateDeviceInfo2(request).then( ( rows )  => {
        log.logAuth(`updateDeviceInfo2() success for MobileNo - (${request.userInfo.userId})  )` )
          resolve( generateGoodResponse( rows ));
      }, (err) => {
        log.logAuth(`updateDeviceInfo2() failed for MobileNo - (${request.userInfo.userId}) & error (${err} )` )
        reject( generateBadResponse( err ));
      });
    } );
}

module.exports.updateUserKycInfo = ( request  ) => {
  return new Promise( (resolve, reject ) => {
    log.logAuth('Receiving request from server : ' + JSON.stringify(request) );
    log.logAuth(`updateUserKYC ( ${request.userInfo.userId} ) on lend_user_KYC_info table ` );
    db.updateUserKYC( request ).then(( rows ) => {
      log.logAuth(`updateUserKYC() success for userId - (${request.userInfo.userId}) ` );
      console.log("updated user kyc rows " + JSON.stringify(rows))
      if( rows.affectedRows === 0 ){
        return db.insertUserKYC( request );
      }else{
        resolve( generateGoodResponse( rows ));
      }
    }, (err) => {
      log.logAuth(`updateUserKYC() failed for userId - (${request.userInfo.userId}) ` )
      log.logAuth( `${err} - for bad response `)
      reject( generateBadResponse( err ));
    }).then( (result) => {
      log.logAuth(`insertUserKYC() success for userId - (${request.userInfo.userId}) ` );
      log.logAuth(`${result} - for good response `);
      resolve( generateGoodResponse( result ) );
    }, (err) => {
      log.logAuth(`insertUserKYC() failed for userId - (${request.userInfo.userId}) ` )
      log.logAuth( `${err} - for bad response `)
      reject( generateBadResponse( err ));
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
        utils.notificationService( 'ios' );
        resolve( generateGoodResponse( rows ) );
      }else{
        return db.insertUserLocationInfo( request );
      }
    }, ( error ) => {
      log.logAuth(`updateUserLocation() failed for username - (${request.userInfo.username}) ` )
      reject( generateBadResponse( error ));
    }).then( ( rows )  => {
      log.logAuth(`insertUserLocationInfo() success for username - (${request.userInfo.username}) ` );
      log.logAuth(`${rows} - for good response `);
      resolve( generateGoodResponse( rows ) );
    },( error ) => {
      log.logAuth(`insertUserLocationInfo() failed for username - (${request.userInfo.username}) ` )
      reject( generateBadResponse( error ));
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
  return response
}

var generateBadResponse = ( errCode ) => {
  log.logAuth( `Generating Bad Response ... : ${errCode}` );
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
