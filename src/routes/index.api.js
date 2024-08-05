const express = require('express');
const apiRoute = require('./api/index.route.js');

// ------------- REST API --------------- 
const router = express.Router();
router.use('/api',apiRoute);

module.exports = router