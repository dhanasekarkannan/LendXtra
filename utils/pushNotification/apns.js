const apn = require("apn");

var  users = [
  { name: "Wendy", "devices": ["1BF62B62618207185866055184BAE9E0BC5304715C01F597511F4FF0B3C1E4E8", "1BF62B62618207185866055184BAE9E0BC5304715C01F597511F4FF0B3C1E4E8"]},
  { name: "John",  "devices": ["1BF62B62618207185866055184BAE9E0BC5304715C01F597511F4FF0B3C1E4E8"]},
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
    note.sound = "ping.aiff";

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
