// Role Based Authentication
const msgCnfg = require('../config/config.message.js');
const {verifyToken} = require('./auth.token.js');


const verifyAdmin = async (req, res, next) => {
    try {
        verifyToken(req,res,()=>{
            if(req.role.isAdmin === true){
                next();
            }else{
                res.status(200).json({status:401, message : msgCnfg.role});
            }
        });
    } catch (err) {
        res.status(400).json({ status: 400, response: err.message, message: msgCnfg.error });
    }
};


const verifyUser = async (req, res, next) => {
    try{
        verifyToken(req,res,()=>{
            if(req.role.isAdmin === false){
                next();
            }else{
                res.status(200).json({status : 401, message : msgCnfg.role});
            }
        })
    }catch(err){
        res.status(400).json({status : 400, response : err.message, message : msgCnfg.error});
    }
};


module.exports = {verifyAdmin, verifyUser};