const mongoose = require('mongoose');

// @ Create Blacklist Model
const BlackList = new mongoose.model(
    "Blacklist", 
    new mongoose.Schema({
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        signedToken : {
            type : String,
            trim : true
        }
    })
);


module.exports = BlackList;
