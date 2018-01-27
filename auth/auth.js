const fs = require('fs');
const utils = require('../utils/utils.js');
const db = require('../database/mysql/mysql.js');
const log = require('../utils/log.js');

module.exports.vaidateAppVersion = ( request ) =>{
  log.logAuth('Receiving request from server : ' + JSON.stringify(request) );
  log.logAuth(`Validating AppVersion ( ${request.deviceInfo.OS} ) on config ` );
  var response = utils.validateAppVersion(request.deviceInfo.OS, request.deviceInfo.appVersion);
  if( typeof (response) === "object" ){
    log.logAuth(`validateAppVersion() success for OS(${request.deviceInfo.OS}) and version (${request.deviceInfo.appVersion})` );
    return generateGoodResponse( response, `${request.deviceInfo.OS} App found in server` );
  }else{
    log.logAuth(`validateAppVersion() failed for OS(${request.deviceInfo.OS}) and version (${request.deviceInfo.appVersion})` );
    log.logAuth( `${response} - for bad response `);
    return generateBadResponse( response );
  }
}

module.exports.userLogin = ( request  ) => {
  var loginUser = [];

  return new Promise( (resolve, reject ) => {
    log.logAuth('Receiving request from server : ' + JSON.stringify(request) );
    log.logAuth(`validateUser ( ${request.userInfo.mobileNo} ) on lend_user_info table ` );
    db.validateUser( request ).then(( rows ) => {
      log.logAuth(`validateUser() success for MobileNo - (${request.userInfo.mobileNo}) ` );
      if( rows.length !== 0 ){
        return db.validateUserLogin( request )
        .then( ( rows )  => {
          log.logAuth(`validateUserLogin() sucess for MobileNo - (${request.userInfo.mobileNo}) & rows ${JSON.stringify(rows)}` )
          loginUser = rows
          if( rows.length !== 0 ){
            return db.updateLoginInfo(loginUser)
            .then( ( rows )  => {
              log.logAuth(`updateLoginInfo() success for MobileNo - (${request.userInfo.mobileNo})  )` )
              return db.updateDeviceInfo( request, loginUser )
              .then( ( rows )  => {
                log.logAuth(`updateDeviceInfo() success for MobileNo - (${request.userInfo.mobileNo})  )` )
                  resolve( generateGoodResponse( loginUser ));
              }, (err) => {
                log.logAuth(`updateDeviceInfo() failed for MobileNo - (${request.userInfo.mobileNo}) & error (${err} )` )
                reject( generateBadResponse( err ));
              });
            }, (err) => {
              log.logAuth(`UpdateLastLogin() failed for MobileNo - (${request.userInfo.mobileNo}) & error (${err} )` )
              reject( generateBadResponse( err ));
            });
          }else{
            reject( generateBadResponse( "0106" ));
          }
        }, (err) => {
          log.logAuth(`validateUserLogin() failed for MobileNo - (${request.userInfo.mobileNo}) & error (${err} )` )
          reject( generateBadResponse( err ));
        });
      }else{
        reject( generateBadResponse( "0102" ));
      }
    }, (err) => {
      log.logAuth(`validateUser() failed for MobileNo - (${request.userInfo.mobileNo})` )
      reject( generateBadResponse( err ));
    });
  });
}

module.exports.userRegistration = ( request  ) => {
  return new Promise( (resolve, reject ) => {
    log.logAuth('Receiving request from server : ' + JSON.stringify(request) );
    log.logAuth(`userRegistration ( ${request.userInfo.mobileNo} ) on lend_user_info_temp table ` );
    db.validateUserTemp( request ).then(( rows ) => {
      log.logAuth(`validateUserTemp() success for mobileNo - (${request.userInfo.mobileNo}) ` );
      if( rows.length === 0 ){
        return db.insertUserLoginTempReg( request )
        .then( (userInfo) => {
          log.logAuth(`insertUserLoginTempReg() success for mobileNo - (${request.userInfo.mobileNo})  and user Id generated is : ${userInfo.insertId}` );
          var otp = utils.genOtpNum();
          var encrypt =  utils.base64Encrypt(otp);
          log.logAuth(` for OTP : ${otp }  base64 encrypt - (${ encrypt })  &  base64 decrypt - (${utils.base64Decrypt(encrypt)})`)
          return db.genOTP( userInfo.insertId, encrypt )
            .then( (rows ) => {
              var message = `${otp} - otp will expire in 1 minute`;
              utils.sendMail( request.userInfo.emailAddr , "REGISTRATION OTP", message );
              log.logAuth(`genOTP() success for mobileNo - (${request.userInfo.mobileNo}) ` );
              console.log("generated otp record otpId check:" + JSON.stringify(rows) );
              resolve( generateGoodResponse(  `{ "message" : "user registered Successfully", "userId":"${userInfo.insertId}","otpId" :"${rows[rows.length - 1].insertId }" }` ) );
            }, (err) => {
              log.logAuth(`genOTP() failed for mobileNo - (${request.userInfo.mobileNo}) ` );
              log.logAuth( `${err} - for bad response `);
              reject( generateBadResponse( err ));
            } );

        }, (err) => {
          log.logAuth(`insertUserLoginTempReg() failed for mobileNo - (${request.userInfo.mobileNo}) ` );
          log.logAuth( `${err} - for bad response `);
          reject( generateBadResponse( err ));
        });
      }else{
        reject( generateBadResponse( "0101" ));
      }
    }, (err) => {
      log.logAuth(`userRegistration() failed for mobileNo - (${request.userInfo.mobileNo}) ` );
      log.logAuth( `${err} - for bad response `);
      reject( generateBadResponse( err ));
    })
  });
}

module.exports.updateDeviceInfo = ( request ) => {
    return new Promise((resolve, reject ) => {
      db.updateDeviceInfo2(request).then( ( rows )  => {
        log.logAuth(`updateDeviceInfo2() success for MobileNo - (${request.userInfo.userId})  )` );
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
      if( rows.affectedRows === 0 ){
        return db.insertUserKYC( request )
        .then( (result) => {
          log.logAuth(`insertUserKYC() success for userId - (${request.userInfo.userId}) ` );
          log.logAuth(`${result} - for good response `);
          resolve( generateGoodResponse( result ) );
        }, (err) => {
          log.logAuth(`insertUserKYC() failed for userId - (${request.userInfo.userId}) ` )
          log.logAuth( `${err} - for bad response `)
          reject( generateBadResponse( err ));
        });
      }else{
        resolve( generateGoodResponse( rows ));
      }
    }, (err) => {
      log.logAuth(`updateUserKYC() failed for userId - (${request.userInfo.userId}) ` )
      log.logAuth( `${err} - for bad response `)
      reject( generateBadResponse( err ));
    });
  });
}

module.exports.updateUserLocation = ( request  ) => {
  return new Promise( (resolve, reject ) => {
    log.logAuth('Receiving request from server : ' + JSON.stringify(request) );
    log.logAuth(`updateUserLocation ( ${request.userInfo.userId} ) on lend_user_location_info table ` );
    db.updateUserLocation( request ).then(( rows ) => {
      log.logAuth(`updateUserLocation() success for username - (${request.userInfo.userId}) ` );
      log.logAuth(`${rows.affectedRows} - for good response `);
      var numRows = rows.affectedRows;
      if( numRows !== 0 ){
        utils.notificationService( 'ios' );
        resolve( generateGoodResponse( rows ) );
      }else{
        return db.insertUserLocationInfo( request )
        .then( ( rows )  => {
          log.logAuth(`insertUserLocationInfo() success for username - (${request.userInfo.userId}) ` );
          log.logAuth(`${rows} - for good response `);
          resolve( generateGoodResponse( rows ) );
        },( error ) => {
          log.logAuth(`insertUserLocationInfo() failed for username - (${request.userInfo.userId}) ` )
          reject( generateBadResponse( error ));
        } );
      }
    }, ( error ) => {
      log.logAuth(`updateUserLocation() failed for username - (${request.userInfo.userId}) ` )
      reject( generateBadResponse( error ));
    });
  });
}

module.exports.borrowRequest = ( request  ) => {
  return new Promise( (resolve, reject ) => {
    log.logAuth('Receiving request from server : ' + JSON.stringify(request) );
    db.insertBorrowRequest( request ).then(( rows ) => {
      log.logAuth(`insertBorrowRequest() success for userId - (${request.userInfo.userId}) `  );
      if( rows.affectedRows !== 0 ){
        return db.fetchLocationInfo( request )
        .then( (rows) => {
          log.logAuth(`fetchLocationInfo() success for userId - (${request.userInfo.userId}) ` );
          log.logAuth(`${JSON.stringify(rows)} - for good response `);
          if( rows.length !== 0 ){
            return db.fetchNearbyUsers( rows[0] )
            .then( (rows) => {
              if( rows.length !== 0){
                log.logAuth(`fetchNearbyUsers() success for userId - (${request.userInfo.userId}) ` );
                log.logAuth(`${JSON.stringify(rows)} - for good response `);
                rows.forEach( (row) => {
                  db.fetchUserInfo( row ).then( ( userInfo ) => {
                    log.logAuth(`fetchUserInfo() success for userId - (${row.userId}) ` );
                     utils.notificationService( userInfo[0], request )
                  } , (err)=>{
                    log.logAuth(`fetchUserInfo() failed for userId - (${row.userId}) ` );
                      reject( generateBadResponse(err ));
                  } );
                } );
                resolve( generateGoodResponse( rows ) );

              }else{
                log.logAuth(`fetchNearbyUsers() failed for userId - (${request.userInfo.userId}) ` )
                log.logAuth( `0115 - for bad response `)
                reject( generateBadResponse( "0115" ) );

              }
            }, (err) => {
              log.logAuth(`fetchNearbyUsers() failed for userId - (${request.userInfo.userId}) ` )
              log.logAuth( `${err} - for bad response `)
              reject( generateBadResponse( err ));
            });
          }else{
            reject( generateBadResponse( "0113" ));
          }
        }, (err) => {
          log.logAuth(`fetchLocationInfo() failed for userId - (${request.userInfo.userId}) ` )
          log.logAuth( `${err} - for bad response `)
          reject( generateBadResponse( err ));
        });
      }else{
        reject( generateBadResponse( "0111" ));
      }
    }, (err) => {
      log.logAuth(`insertBorrowRequest() failed for userId - (${request.userInfo.userId}) ` )
      log.logAuth( `${err} - for bad response `)
      reject( generateBadResponse( err ));
    });
  });
}



module.exports.bidRequest = ( request ) => {
  return new Promise( (resolve, reject ) => {
    log.logAuth('Receiving request from server for bidRequest : ' + JSON.stringify(request) );
    db.insertBidRequest( request ).then(( rows ) => {
      log.logAuth(`insertBidRequest() success for userId - (${request.userInfo.userId}) `  );
      if( rows.affectedRows !== 0 ){
        resolve ( generateGoodResponse( '{ "message" : "bid inserted Successfully" }' ));
      }else{
        reject( generateBadResponse( "0116" ));
      }
    }, (err) => {
      log.logAuth(`insertBorrowRequest() failed for userId - (${request.userInfo.userId}) ` )
      log.logAuth( `${err} - for bad response `)
      reject( generateBadResponse( err ));
    });
  });
}

module.exports.validateRegOtp = ( request ) => {
  return new Promise( (resolve, reject ) => {
    log.logAuth('Receiving request from server for validateRegOtp() : ' + JSON.stringify(request) );
    db.validateOtp( request ).then(( rows ) => {
      if( rows.length !== 0 ){
        log.logAuth(`validateRegOtp() success for userId - (${request.userInfo.otpId}) `  );
        return db.insertUserLoginReg( request )
        .then( ( rows )  => {
          log.logAuth(`insertUserLoginReg() success for userId - (${request.userInfo.userId}) ` );
          log.logAuth(`${rows} - for good response `);
          resolve ( generateGoodResponse( '{ "message" : "Otp Verified Successfully, User Registered successfully" }' ));
        },( error ) => {
          log.logAuth(`insertUserLoginReg() failed for userId - (${request.userInfo.userId}) ` )
          reject( generateBadResponse( error ));
        } );

      }else{
        reject( generateBadResponse( "0123" ));
      }
    }, (err) => {
      log.logAuth(`validateRegOtp() failed for userId - (${request.userInfo.otpId}) ` )
      log.logAuth( `${err} - for bad response `)
      reject( generateBadResponse( err ));
    });
  });
}

var generateGoodResponse = ( body ) => {
  log.logAuth( 'Generating Good Response ...' );

  if( typeof (body) === "object"){
    var response  = {
      responseCode : 0,
      body : body
    }
    logResponse( 'Sending Good Response to server : '  , response )
    return response;
  }else{
    var response  = {
      responseCode : 0,
      body : JSON.parse(body)
    }
    logResponse( 'Sending Good Response to server : '  , response )
    return response;
  }

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
