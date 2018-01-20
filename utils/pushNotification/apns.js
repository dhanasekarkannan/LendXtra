const apn = require("apn");

var options = {
  token: {
    key: "./config/certificates/AuthKey_9AEKQ833VE.p8",
    keyId: "9AEKQ833VE",
    teamId: "E632ZM73US"
  },
  production: false
};

var apnProvider = new apn.Provider(options);

module.exports.sendNotification =  ( userInfo, request  ) => {


    let note = new apn.Notification();
    note.alert = `Hey ${userInfo.userId}, your near by user need a product under ${ request.borrowInfo.category }`;
    note.sound = "ping.aiff";

    note.topic = "com.dhanasekar.Test.lend.LendPush";

    console.log(`Sending: ${note.compile()} to ${userInfo.deviceToken}`);

    apnProvider.send(note, userInfo.deviceToken).then( result => {
        console.log("sent:", result.sent.length);
        console.log("failed:", result.failed.length);
        console.log(result.failed);
    });


  apnProvider.shutdown();
}
