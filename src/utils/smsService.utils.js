const msgCnfg = require('../config/config.message');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const SendSMS = async (sms) => {
    try {
        const sendResp = await client.messages.create({ 
            from: '+17076076401', 
            body: sms.message , 
            to: "+918068082575" 
        });
        if(sendResp){
            res.status(200).json({status : 201, response : sendResp.sid , message : "Message Send Successfully"})
        }else{
            res.status(200).json({status : 401, response : sendResp.sid , message : "Message Not Send"})
        }
    } catch (err) {
        res.status(400).json({status : 400, message : msgCnfg.error});
    }
};



module.exports = SendSMS;
