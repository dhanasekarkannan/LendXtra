const apn = require("apn");

var  users = [
  { name: "Wendy", "devices": ["5BA3EF0C434C9FC8532052DD331711233A13C40AA1891385C9D53393E41915F5", "5BA3EF0C434C9FC8532052DD331711233A13C40AA1891385C9D53393E41915F5"]},
  { name: "John",  "devices": ["5BA3EF0C434C9FC8532052DD331711233A13C40AA1891385C9D53393E41915F5"]},
];
// var  users = [ ];
var options = {
  token: {
    key: "./config/certificates/AuthKey_9AEKQ833VE.p8",
    keyId: "9AEKQ833VE",
    teamId: "E632ZM73US"
  },
  production: false
};

var apnProvider = new apn.Provider(options);

// let service = new apn.Provider({
//   cert: "./config/certificates/cert.pem",
//   key: "./config/certificates/AuthKey_9AEKQ833VE.pem",
// });
module.exports.sendNotification =  () => {
  users.forEach( (user) => {

    let note = new apn.Notification();
    note.alert = `Hey ${user.name}, I just sent my first Push Notification`;

    note.topic = "com.dhanasekar.Test.lend.LendPush";

    console.log(`Sending: ${note.compile()} to ${user.devices}`);

    apnProvider.send(note, user.devices).then( result => {
        console.log("sent:", result.sent.length);
        console.log("failed:", result.failed.length);
        console.log(result.failed);
    });
  });

  apnProvider.shutdown();
}
