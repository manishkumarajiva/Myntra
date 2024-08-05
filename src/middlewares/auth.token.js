const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model.js');
const BlackListModel = require('../models/blacklist.model.js');
const { default: mongoose } = require('mongoose');
const msgCnfg = require('../config/config.message.js');


const accessToken = (user) => {
    return new Promise((resolve, reject) => {

        const payload = {
            id: user._id,
            email: user.email
        }

        const option = {
            issuer: 'manish',
            expiresIn: '1d'
        }
        jwt.sign(payload, process.env.SECRET_KEY, option, (error, token) => {
            if (error) throw error;
            resolve(token)
        })
    })
};


const verifyToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token) {
            token = token.split(" ")[1];
            const user = jwt.verify(token, process.env.SECRET_KEY);
            const blacklistedToken = await BlackListModel.findOne({signedToken: String(token) });
            if (blacklistedToken === null) {
                const role = await UserModel.findById({ _id: new mongoose.Types.ObjectId(user.id) });
                req._id = user.id;
                req.role = role;
                next();
            } else {
                return res.status(200).json({ status: 401, message: msgCnfg.session });
            }
        } else {
            res.status(200).json({ status: 400, message: "Unauthorized User" })
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.message, message: msgCnfg.etoken })
    }
};



module.exports = { accessToken, verifyToken }





// Stateless - jwt tokens part
// This is most efficient when you wish to reduce the load on the database
// Not need memory
// Long session like 30 days
// Not secure 
// Signature for security
// HTTP Authorization headers passed
// header / payload / signature - they hold all information
// header = time , algorytham hmac  ----- hassed message authintacitation code , etc
// payload = contain actual infromation of user, claims => userinfo, expire time, secrect key
// signature = calculate => header,secretkey,payload
// Only use in authorization not in authentication => fetch signature and compare with secrectKey
// BLACK LISTING - maintain those token are invalidate
// LOGOUT ISSUE = CLAIM expiresIn


// How Statefull archticture work ---- Cookies, Session
// in statefull -- we are generate and IDs for users who have an account And Exist in database
// use mapping
// Sesstion ID it is reference token --- it reference the value
// Not scalable --- if server is re-start all users logout and session destroyed
// using Map meaning new Map() - during restart SERVER map is blank *****
// HTTPS STATELESS protocole

