const express = require("express");
const { RegisterUser, LoginUser, LogoutUser, UpdateUser, DeleteUser, GetUserProfile } = require('../../controllers/user.controllers.js');
const { UpdatePassword, ForgetPassword, ResetPassword, VerifyUserAccount } = require('../../controllers/user.controllers.js');

const { verifyToken } = require('../../middlewares/auth.token.js');
const { Uploader } = require('../../middlewares/auth.upload.js');
const { verifyUser } = require("../../middlewares/auth.role.js");

const router = express.Router();

router.post('/register', Uploader("users"), RegisterUser);
router.post('/login', LoginUser);
router.get('/logout', verifyUser, LogoutUser);
router.get('/getProfile',verifyToken, GetUserProfile);
router.put('/update',verifyToken ,Uploader("users"), UpdateUser);
router.delete('/delete', verifyToken, DeleteUser);
router.get('/verifyUser', VerifyUserAccount);

router.put('/updatePassword', verifyToken, UpdatePassword);
router.post('/forgetPassword', ForgetPassword);
router.put('/resetPassword', ResetPassword)

module.exports = router;