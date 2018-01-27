const fs = require('fs');
const apn = require('./pushNotification/apns.js');
const moment = require('moment');
const randomString = require('random-string');
const nodemailer = require("nodemailer");
const base64 = require('base-64');
const utf8 = require('utf8');
const CryptoJS = require("crypto-js");


var now =  moment(new Date()).format("DDMMYYYYHHmmss");

var genAlphaNumRandom = ( length ) => {
  var x = randomString({
    length: length,
    numeric: true,
    letters: true,
    special: false
  });
  return x;
}
var genOtpNum = (  ) => {
  var x = randomString({
    length: 6,
    numeric: true,
    letters: false,
    special: false
  });
  return x;
}
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "sendmailtodhana@gmail.com",
        pass: "natavxlswpavztah"
    }
});

var sendMail = ( toEmailId, subject, message ) => {
  var mailOptions={
    to : toEmailId,
    subject : subject,
    text : message
}
console.log(mailOptions);
smtpTransport.sendMail(mailOptions, function(error, response){
 if(error){
        console.log("Message sent failed : "  + error);
        return false;
    // res.end("error");
 }else{
        console.log("Message sent Success : " + response.message);
    // res.end("sent");
      return true;
     }
});
}
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

var notificationService = (  userInfo, request ) => {
  if( userInfo.deviceType === 'ios' ){
    apn.sendNotification( userInfo, request );
  }else if( userInfo.deviceType === 'android'){

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

var base64Encrypt = ( text ) => {
    var bytes = utf8.encode(text);
    return base64.encode(bytes);
}
var base64Decrypt = ( encrypt ) => {
    var bytes = base64.decode(encrypt);
    return utf8.decode(bytes);
}
module.exports = {
  validateAppVersion,
  getErrorDesc,
  notificationService,
  sendMail,
  genOtpNum,
  genAlphaNumRandom,
  base64Encrypt,
  base64Decrypt
};
