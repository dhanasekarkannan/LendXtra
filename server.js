const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;
const log = require('./utils/log.js');
const auth = require('./auth/auth.js');
const session = require('express-session')


app.use(bodyParser.json());
app.get('/', ( request, response ) => {
  response.send({ "id" : 1, "user" : "dhanasekar"});
  log.logServer( `${request.method} ${request.url}` );
  log.logServer(' Response sent ');
});
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(session({
  secret: 'hjsufhk34291jsdffl',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: (60000) }

}));

app.post('/appVerisonCheck', ( request, response ) => {
  log.logServer( 'Sending request to auth processor =' + JSON.stringify(request.body) );
  var resp = auth.vaidateAppVersion(request.body);
  log.logServer( 'Receiving response from auth processor =' + JSON.stringify(resp) );
  response.send(resp);
});

app.post('/userLogin', ( request, response ) => {
  console.log( 'Receiving request from client =' + JSON.stringify(request.body) );
  log.logServer( 'Sending request to auth processor =' + JSON.stringify(request.body) );
  auth.userLogin(request.body ).then(( resp ) =>{
  log.logServer( 'Receiving Good response from auth processor =' + JSON.stringify(resp) );
  request.session.user = request.body;
  response.status("200").send(resp);
  }, (err) => {
    log.logServer( 'Receiving Bad response from auth processor =' + JSON.stringify(err) );
    response.status("200").send(err);
  });
});

app.post('/userRegistration', ( request, response ) => {
  log.logServer( 'Sending request to auth processor =' + JSON.stringify(request.body) );
  auth.userRegistration(request.body ).then(( resp ) =>{
  log.logServer( 'Receiving Good response from auth processor =' + JSON.stringify(resp) );
  response.status("200").send(resp);
  }, (err) => {
    log.logServer( 'Receiving Bad response from auth processor =' + JSON.stringify(err) );
    response.status("200").send(err);
  });
});
app.post('/updateUserKYC', ( request, response ) => {
  log.logServer( 'Sending request to auth processor =' + JSON.stringify(request.body) );
  auth.updateDeviceInfo(request.body ).then(( resp ) =>{
  log.logServer( 'Receiving Good response from auth processor =' + JSON.stringify(resp) );
  return auth.updateUserKycInfo(request.body)
  .then(( resp ) =>{
  log.logServer( 'Receiving Good response from auth processor =' + JSON.stringify(resp) );
  response.status("200").send(resp);
  }, (err) => {
    log.logServer( 'Receiving Bad response from auth processor =' + JSON.stringify(err) );
    response.status("200").send(err);
  });
  }, (err) => {
    log.logServer( 'Receiving Bad response from auth processor =' + JSON.stringify(err) );
    response.status("200").send(err);
  })
});
app.post('/updateUserLocation', ( request, response ) => {
  log.logServer( 'Sending request to auth processor =' + JSON.stringify(request.body) );
  auth.updateUserLocation(request.body ).then(( resp ) =>{
  log.logServer( 'Receiving Good response from auth processor =' + JSON.stringify(resp) );
  response.status("200").send(resp);
  }, (err) => {
    log.logServer( 'Receiving Bad response from auth processor =' + JSON.stringify(err) );
    response.status("200").send(err);
  });
});
app.post('/borrowRequest', ( request, response ) => {

  if( request.session.user ){

    log.logServer( 'Sending request to auth processor =' + JSON.stringify(request.body) );
    auth.updateDeviceInfo(request.body ).then(( resp ) =>{
    log.logServer( 'Receiving Good response from auth processor updateDeviceInfo() =' + JSON.stringify(resp) );
    return auth.borrowRequest(request.body)
    .then(( resp ) =>{
    log.logServer( 'Receiving Good response from auth processor borrowRequest() =' + JSON.stringify(resp) );
    response.status("200").send(resp);
    }, (err) => {
      log.logServer( 'Receiving Bad response from auth processor borrowRequest() =' + JSON.stringify(err) );
      response.status("200").send(err);
    });
    }, (err) => {
      log.logServer( 'Receiving Bad response from auth processor updateDeviceInfo() =' + JSON.stringify(err) );
      response.status("200").send(err);
    })
  }else{

    log.logServer( ' session unauthorized ' );
    response.status("401").send();

  }
});


app.post('/bidRequest', ( request, response ) => {

  if( request.session.user ){

    log.logServer( 'Sending request to auth processor =' + JSON.stringify(request.body) );
    auth.updateDeviceInfo(request.body ).then(( resp ) =>{
    log.logServer( 'Receiving Good response from auth processor updateDeviceInfo() =' + JSON.stringify(resp) );
    return auth.bidRequest(request.body)
    .then(( resp ) =>{
    log.logServer( 'Receiving Good response from auth processor bidRequest() =' + JSON.stringify(resp) );
    response.status("200").send(resp);
    }, (err) => {
      log.logServer( 'Receiving Bad response from auth processor bidRequest() =' + JSON.stringify(err) );
      response.status("200").send(err);
    });
    }, (err) => {
      log.logServer( 'Receiving Bad response from auth processor updateDeviceInfo() =' + JSON.stringify(err) );
      response.status("200").send(err);
    })
  }else{

    log.logServer( ' session unauthorized ' );
    response.status("401").send();

  }
});

app.post('/validateRegOtp', ( request, response ) => {
  log.logServer( 'Sending request to auth processor validateRegOtp()=' + JSON.stringify(request.body) );
  auth.validateRegOtp(request.body ).then(( resp ) =>{
  log.logServer( 'Receiving Good response from auth processor validateRegOtp() =' + JSON.stringify(resp) );
  response.status("200").send(resp);
  }, (err) => {
    log.logServer( 'Receiving Bad response from auth processor validateRegOtp() =' + JSON.stringify(err) );
    response.status("200").send(err);
  });
});


app.post('/logout', ( request , response ) => {

  if( request.session.user ){

    // request.session.destroy( function( err ){
    //   response.status("200").send({
      //   response : "1",
      //   body : {
      //     errorCode : "0117",
      //     errorDesc : "logout failed"
      //   }
      // // });
    // })
    response.status("200").send({
      response : "0",
      body : {
        message : "successfully logged out"
      }
    })

  }else{
    log.logServer( ' session unauthorized ' );
    response.status("401").send();

  }

});

app.listen(port, () => {
  console.log(`$$$$$$$$$$$$$$$$$$ Server started running on port ${port} $$$$$$$$$$$$$$$$$$$$$$`);
  log.logServer( `$$$$$$$$$$$$$$$$$$ Server started running on port ${port} $$$$$$$$$$$$$$$$$$$$$$` );
})
