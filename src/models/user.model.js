const mongoose = require('mongoose');

//@User Schema included Admin
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    gender: String,
    mobile: {
        type: String,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    file: {
        name: {
            type: String,
            trim: true
        },
        url: {
            type: String,
            trim: true
        }
    },
    // cfile: {
    //     public_id: {
    //         type: String,
    //         trim: true
    //     },
    //     url: {
    //         type: String,
    //         trim: true
    //     }
    // },
    password: {
        type: String,
        trim: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    resetPasswordToken : {
        type : String,
        trim : true
    },
    verificationToken : {
        type : String,
        trim : true
    },
    verify : {
        type : Boolean,
        default : false
    }
}, { timestamps: true });

//User Model
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;




