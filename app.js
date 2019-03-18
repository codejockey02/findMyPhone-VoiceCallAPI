const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const api = require('./api.js');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('242758AH31FYTYG5bc3238e');
const port = process.env.PORT || 3000;
app.use(bodyParser.json({
    limit: '25mb',
}));
bodyParser.urlencoded({
    extended: true,
    limit: '25mb',
});
var voiceDeliveryReceiptApi = new api.VoiceApi("priyeshs2", "54AAA751-70D1-6183-BAB5-6492CAEAB8F5");
var smsApi = new api.SMSApi("priyeshs2", "54AAA751-70D1-6183-BAB5-6492CAEAB8F5");

var voiceMessage = new api.VoiceMessage();
var smsMessage = new api.SmsMessage();

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
    sendOtp.send(number, "FINDME", "569812", function (error, data) {});
    res.json({
        error: false,
        code: null,
        output: 'Success',
    });
});

app.post('/verify', async (req, res) => {
    const otp = req.body.otp;
    if (otp == "569812") {
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