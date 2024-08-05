const express = require('express');
const { RegisterUser, LoginUser, UpdateUser, DeleteUser, GetAllUsers, GetUserProfile, LogoutUser, VerifyUserAccount } = require('../../controllers/user.controllers.js');
const { verifyAdmin } = require('../../middlewares/auth.role.js');
const { Uploader } = require('../../middlewares/auth.upload.js');
const { verifyToken } = require('../../middlewares/auth.token.js');

//----------- REST API -----------
const router = express.Router();

router.post('/register', Uploader('users'), RegisterUser);
router.post('/login', LoginUser);
router.put('/verify', verifyAdmin, VerifyUserAccount)
router.get('/logout', verifyAdmin, LogoutUser);
router.get('/getProfile',verifyToken ,GetUserProfile);
router.get('/getAllUsers' ,verifyAdmin, GetAllUsers);
router.put('/update',verifyToken ,Uploader('users'), UpdateUser);
router.delete('/delete',verifyAdmin, DeleteUser);

module.exports = router;