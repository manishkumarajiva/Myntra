const UserModel = require('../models/user.model.js');
const BlackListModel = require('../models/blacklist.model.js');
const msgCnfg = require('../config/config.message.js');
const bcrypt = require('bcryptjs');
const { createUserValidation, loginUserValidation } = require('../validation/user.validation.js')
const { accessToken } = require('../middlewares/auth.token.js');
const { default: mongoose } = require('mongoose');
const fs = require('fs');
const SendEmail = require('../utils/email.utils.js');
const SendTokenCookies = require('../utils/sendToken.utils.js');
const randomString = require('randomstring');
const cloudinary = require('cloudinary').v2;



const RegisterUser = async (req, res) => {
    const AllUsers = await UserModel.find({});

    if ((req.body.isAdmin) && AllUsers.some(user => user.isAdmin)) {
        return res.status(200).json({ status: 401, message: "Admin already exist, Only one admin allowed" });
    }
    let filename = '';
    if (req.file) {
        filename = req.file.filename;
    }
    else {
        return res.status(200).json({ status: 401, message: msgCnfg.imageType });
    }


    const imageCloud = await cloudinary.uploader.upload(req.file.path, { folder: 'users', width: 100 });
    let fileObject1 = new Object({
        name: imageCloud.public_id,
        url: imageCloud.secure_url
    });



    try {
        const { error, value } = createUserValidation.validate(req.body);
        if (error) {
            return res.status(200).json({ status: 401, response: error.message, message: msgCnfg.payload });
        } else {
            const isEmail = await UserModel.findOne({ email: value.email });
            if (isEmail) {
                return res.status(200).json({ status: 401, message: msgCnfg.email });
            } else {
                const hashedPassword = await bcrypt.hash(value.password, 12);

                let fileObject = new Object({
                    name: filename,
                    url: "http://localhost:3000/uploads/users/"
                });


                const token = randomString.generate({ charset: "alphanumeric", length: 6 })
                const createPayload = {
                    name: value.name,
                    gender: value.gender,
                    mobile: value.mobile,
                    email: value.email,
                    isAdmin: value.isAdmin,
                    password: hashedPassword,
                    file: fileObject,
                    file1: fileObject1,
                    verificationToken: token
                }
                const createResp = await UserModel.create(createPayload);

                if (createResp) {
                    const token = await accessToken(createResp);
                    SendEmail({
                        subject: msgCnfg.sregister,
                        html: "Hi &nbsp; " + value.name + " <br> Your login credientials are below :- <br> Email : &mnsp; " + value.email +
                            "<br> Please Verify Your Account &nbsp; <br> <br> <a style = 'background-color:blue; padding : 5px 25px; border : 1px gray solid; color : white; font-size : 16px;' href='http://localhost:3000/api/user/verifyUser?verificationToken=" + token + "'> Verify  </a> "
                    });
                    SendTokenCookies(createResp, token, 201, msgCnfg.screate, res);
                } else {
                    res.status(200).json({ status: 401, response: createResp, message: msgCnfg.fcreate });
                }
            }
        }
    } catch (error) {
        res.status(400).json({ status: 400, response: error.stack, message: msgCnfg.error });
    }
};



const LoginUser = async (req, res) => {
    try {
        const { error, value } = await loginUserValidation.validate(req.body);
        if (error) {
            return res.status(200).json({ status: 401, response: error.message, message: msgCnfg.payload });
        }

        const userExist = await UserModel.findOne({ email: value.email });
        if (!userExist) {
            return res.status(200).json({ status: 401, message: msgCnfg.notExist });
        } else if (userExist) {
            const isPassMatch =  bcrypt.compare(value.password, userExist.password);
            if (!isPassMatch) {
                return res.status(200).json({ status: 401, message: msgCnfg.psfmatch });
            } else if (userExist && isPassMatch) {
                const token = await accessToken(userExist);
                SendTokenCookies(userExist, token, 201, msgCnfg.slogin, res);
            }
        } else {
            return res.status(200).json({ status: 401, message: msgCnfg.flogin })
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.message, message: msgCnfg.error });
    }
};



const LogoutUser = async (req, res) => {
    const userid = new mongoose.Types.ObjectId(req._id);
    try {
        const blacklistResp = await BlackListModel.create({ userId: userid, signedToken: req.signedCookies.Token })
        if (blacklistResp) {
            res.cookie("Token", null, { expires: new Date(Date.now()) }, { httpOnly: true });
            return res.status(201).json({ status: 201, message: msgCnfg.slogout });
        } else {
            return res.status(401).json({ status: 401, message: msgCnfg.flogout });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.error });
    }
};



const GetUserProfile = async (req, res) => {
    const userid = new mongoose.Types.ObjectId(req._id);

    try {
        const getResp = await UserModel.findById({ _id: userid });

        if (getResp) {
            res.status(200).json({ status: 201, response: getResp, message: msgCnfg.sread });
        } else {
            res.status(200).json({ status: 401, response: getResp, message: msgCnfg.fread });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.message, message: msgCnfg.error });
    }
};



const GetAllUsers = async (req, res) => {
    try {
        const getResp = await UserModel.find({ isAdmin: false });
        if (getResp.length > 0) {
            res.status(200).json({ status: 201, response: getResp, message: msgCnfg.sread });
        } else {
            res.status(200).json({ status: 401, response: getResp, message: msgCnfg.fread });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.message, message: msgCnfg.error });
    }
};



const UpdateUser = async (req, res) => {
    const userid = new mongoose.Types.ObjectId(req._id);
    let updatePayload = new Object();
    console.log(req.file)
    if (req.file) {
        let fileObject = new Object({
            name: req.file.filename,
            url: "http://localhost:3000/uploads/users/"
        });
        updatePayload = {
            name: req.body.name,
            gender: req.body.gender,
            mobile: req.body.mobile,
            file: fileObject
        }
    } else {
        updatePayload = {
            name: req.body.name,
            gender: req.body.gender,
            mobile: req.body.mobile
        }
    }

    // remove previous file
    const previousImage = await UserModel.findById({ _id: userid });
    const path = `./uploads/users/${previousImage.file.name}`;

    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    };

    try {
        const updateResp = await UserModel.findByIdAndUpdate({ _id: userid }, updatePayload, { new: true });
        if (updateResp) {
            res.status(200).json({ status: 201, response: updateResp, message: msgCnfg.supdate });
        } else {
            res.status(200).json({ status: 401, response: updateResp, message: msgCnfg.fupdate });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.message, message: msgCnfg.error });
    }
};



const DeleteUser = async (req, res) => {
    const userid = new mongoose.Types.ObjectId(req.query.userid);
    try {
        const user = await UserModel.findById({ _id: userid });
        if (user.isAdmin === true) {
            return res.status(200).json({ status: 401, message: "Admin Cannot be deleted, only modify" });
        } else {
            // remove previous image
            const path = `./uploads/users/${user.file.name}`;
            if (fs.existsSync(path)) {
                fs.unlinkSync(path);
            }
            const deleteResp = await UserModel.findByIdAndDelete({ _id: userid });
            if (deleteResp) {
                res.status(200).json({ status: 201, response: deleteResp, message: msgCnfg.sdelete });
            } else {
                res.status(200).json({ status: 401, response: deleteResp, message: msgCnfg.fdelete });
            }
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.message, message: msgCnfg.fdelete })
    }
};



const VerifyUserAccount = async (req, res) => {
    try {
        const verifyUser = await UserModel.findOne({ verificationToken: req.query.verificationToken });
        if (verifyUser) {
            const verifyResp = await UserModel.findByIdAndUpdate({ _id: verifyUser._id }, { verificationToken: '', verify: true }, { new: true });
            if (verifyResp) {
                return res.status(200).json({ status: 201, response: verifyResp, message: "Verified" });
            } else {
                return res.status(200).json({ status: 201, response: verifyResp, message: "Not Verified" });
            }
        } else {
            return res.status(200).json({ status: 401, message: msgCnfg.elink });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.error });
    }
};



const UpdatePassword = async (req, res) => {
    const userid = new mongoose.Types.ObjectId(req.role._id);
    try {
        const userExist = await UserModel.findById({ _id: userid });
        const isPasswordMatch = await bcrypt.compare(req.body.oldPassword, userExist.password);
        if (isPasswordMatch) {
            const newPassword = await bcrypt.hash(req.body.newPassword, 12);
            const updateResp = await UserModel.findByIdAndUpdate({ _id: userid }, { $set: { password: newPassword } }, { new: true });
            const token = await accessToken(updateResp);
            SendTokenCookies(userExist, token, 201, msgCnfg.psupdate, res);
        } else {
            return res.status(200).json({ status: 401, message: msgCnfg.psfmatch });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.err });
    }
}



const ForgetPassword = async (req, res) => {
    try {
        const userExist = await UserModel.findOne({ email: req.body.email });
        if (userExist) {
            const token = randomString.generate();
            const updateResp = await UserModel.updateOne({ _id: userExist._id }, { $set: { resetPasswordToken: token } }, { new: true });
            sendEmail({
                subject: "Reset Password",
                html: "<h3> Hi" + `${userExist.name} <br> Your email is : ${userExist.email} <br> Please Click on link given for ` + `<a style = 'background-color:blue; padding : 10px 35px; border : 1px gray solid; color : white; font-size : 16px;' href="http://localhost:3000/user/resetPassword?token=${token}"> Reset Password </a>` + "<h3>"
            });
            return res.status(200).json({ status: 200, message: msgCnfg.sendEmail });
        } else {
            return res.status(200).json({ status: 401, message: msgCnfg.notExist })
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.err });
    }
};



const ResetPassword = async (req, res) => {
    try {
        const userExist = await UserModel.findOne({ resetPasswordToken: req.query.token });
        if (userExist) {
            const newPassword = await bcrypt.hash(req.body.newPassword, 12);
            const updatePayload = new Object({
                password: newPassword,
                resetPasswordToken: ''
            })
            const updateResp = await UserModel.findByIdAndUpdate({ _id: userExist._id }, updatePayload, { new: true });
            if (updateResp) {
                const token = await accessToken(updateResp);
                SendTokenCookies(userExist, token, 201, msgCnfg.supdate, res);

            } else {
                return res.status(200).json({ status: 401, response: updateResp, message: msgCnfg.fupdate });
            }
        } else {
            return res.status(200).json({ status: 401, message: msgCnfg.elink });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.err });
    }
};



module.exports = { RegisterUser, LoginUser, LogoutUser, GetUserProfile, UpdateUser, DeleteUser, GetAllUsers, UpdatePassword, ForgetPassword, ResetPassword, VerifyUserAccount };