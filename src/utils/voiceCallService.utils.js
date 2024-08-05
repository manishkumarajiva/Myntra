const msgCnfg = require('../config/config.message');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const VoiceCall = async (voiceCall) => {
    try {
        const voiceCallResp = client.calls.create({
            url: 'https://343b-2409-4051-2dbd-fc71-762-2df0-ad94-5e8e.ngrok-free.app/',
            from: '+17076076401',
            to: '+918168082575'
        });
        if (voiceCallResp) {
            res.status(200).json({ status: 201, response: voiceCallResp.sid, message: "Calling....." });
        } else {
            res.status(200).json({ status: 401, response: voiceCallResp.sid, message: "Not Calling" });
        }
    } catch (err) {
        res.status(400).json({ status: 400, message: msgCnfg.error });
    }
};

module.exports = VoiceCall
