const fs = require('fs');
const apn = require('./pushNotification/apns.js');
const moment = require('moment');
var now =  moment(new Date()).format("DDMMYYYYHHmmss");

var fetchAppVersion = () => {
  try {
    var appVersionStrings = fs.readFileSync('./config/app.config');
    return JSON.parse(appVersionStrings);
  } catch (e) {
    return [];
  }
};

var getApp = (osTitle) => {
  var apps = fetchAppVersion();
  var filteredApp = apps.filter((app) => app.osTitle === osTitle);
  return filteredApp[0];
};

var validateAppName = ( osTitle ) => {
    var app = getApp( osTitle );
    if( app ){
      return true
    }else{
      return false
    }
}

var validateAppVersion = ( osTitle , version ) => {
  var app = getApp( osTitle )
  if( app ){
    if( app.appVersion === version ){
      return app
    }else{
      return "0002"
    }
  }else{
    return "0001"
  }
}

var notificationService = ( device) => {
  if( device === 'ios'){
    apn.sendNotification();
  }else if( device === 'android'){

  }else{

  }

}

var getErrorDesc = ( errorCode ) => {
  var error = fetchErrorDesc()
  var filteredError = error.filter((err) => err.errorCode === errorCode);
  return filteredError[0];
}
var fetchErrorDesc = () => {
  try {
    var messages = fs.readFileSync('./config/messageProperties.config');
    return JSON.parse(messages);
  } catch (e) {
    console.log('failed to fetch messageProperties', e);
    return [];
  }
};


module.exports = {
  validateAppVersion,
  getErrorDesc,
  notificationService,
};
