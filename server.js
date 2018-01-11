const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;
const log = require('./utils/log.js');
const auth = require('./auth/auth.js');

app.use(bodyParser.json());
app.get('/', ( request, response ) => {
  response.send('You have successfully hitted LEND server ');
  log.logServer( `${request.method} ${request.url}` );
});

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
  return auth.updateUserKycInfo(request.body);
  }, (err) => {
    log.logServer( 'Receiving Bad response from auth processor =' + JSON.stringify(err) );
    response.status("200").send(err);
  }).then(( resp ) =>{
  log.logServer( 'Receiving Good response from auth processor =' + JSON.stringify(resp) );
  response.status("200").send(resp);
  }, (err) => {
    log.logServer( 'Receiving Bad response from auth processor =' + JSON.stringify(err) );
    response.status("200").send(err);
  });
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
  log.logServer( 'Sending request to auth processor =' + JSON.stringify(request.body) );
  auth.updateDeviceInfo(request.body ).then(( resp ) =>{
  log.logServer( 'Receiving Good response from auth processor updateDeviceInfo() =' + JSON.stringify(resp) );
  return auth.borrowRequest(request.body);
  }, (err) => {
    log.logServer( 'Receiving Bad response from auth processor updateDeviceInfo() =' + JSON.stringify(err) );
    response.status("200").send(err);
  }).then(( resp ) =>{
  log.logServer( 'Receiving Good response from auth processor borrowRequest() =' + JSON.stringify(resp) );
  response.status("200").send(resp);
  }, (err) => {
    log.logServer( 'Receiving Bad response from auth processor borrowRequest() =' + JSON.stringify(err) );
    response.status("200").send(err);
  });
});

app.listen(port, () => {
  console.log(`$$$$$$$$$$$$$$$$$$ Server started running on port ${port} $$$$$$$$$$$$$$$$$$$$$$`);
  log.logServer( `$$$$$$$$$$$$$$$$$$ Server started running on port ${port} $$$$$$$$$$$$$$$$$$$$$$` );
})
