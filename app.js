const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const api = require('./api.js');
const SendOtp = require('sendotp');
const admin = require('firebase-admin');
const sendOtp = new SendOtp('242758AH31FYTYG5bc3238e');
const serviceAccount = require('./serviceAccountKey.json');
const port = process.env.PORT || 3000;
app.use(bodyParser.json({
    limit: '25mb',
}));
bodyParser.urlencoded({
    extended: true,
    limit: '25mb',
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://trackme-2b844.firebaseio.com/",
});

var voiceDeliveryReceiptApi = new api.VoiceApi("priyeshs2", "54AAA751-70D1-6183-BAB5-6492CAEAB8F5");

var voiceMessage = new api.VoiceMessage();

app.post('/call', async (req, res) => {
    const number = req.body.number;
    voiceMessage.to = number;
    voiceMessage.body = "Hello Your phone is nearby Don't be nervous";
    voiceMessage.voice = "female";
    voiceMessage.customString = "this is a test";
    voiceMessage.country = "IN";
    voiceMessage.source = "source";
    voiceMessage.lang = "en-in";
    voiceMessage.requireInput = 0;
    voiceMessage.machineDetection = 0;

    var voiceMessages = new api.VoiceMessageCollection();

    voiceMessages.messages = [voiceMessage]

    voiceDeliveryReceiptApi.voiceSendPost(voiceMessages).then(function (response) {
        console.log(response.body);
        res.json({
            error: false,
            code: null,
            output: 'Success',
        });
    }).catch(function (err) {
        console.error(err.body);
    });
});

app.post('/allowaccess', async (req, res) => {
    const number = req.body.uname;
    console.log(number);
    sendOtp.send(number, "FINDME", "569812", function (error, data) {});
    res.json({
        error: false,
        code: null,
        output: 'Success',
    });
});

app.post('/verify', async (req, res) => {
    const pnumber = req.body.parent;
    const number = req.body.child;
    const name = req.body.childname;
    const otp = req.body.otp;
    if (otp == "569812") {
        const link = `/Users/${pnumber}/allowed/${number}/`;
        let ref = admin.database().ref(link);
        const obj = {
            name,
        };
        ref.set(obj);
        res.json({
            error: false,
            code: null,
            output: 'Success',
        });
    } else {
        res.json({
            error: false,
            code: null,
            output: 'Failed',
        });
    }
});

app.listen(port);
console.log('Online');