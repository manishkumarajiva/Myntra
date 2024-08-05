const express = require('express');
const { CreateOrder, ReadOrder, UpdateOrder, DeleteOrder } = require('../../controllers/order.controllers.js');
const { verifyToken } = require('../../middlewares/auth.token.js');
const { verifyUser } = require('../../middlewares/auth.role.js');

// --------------- REST API ----------------

const router = express.Router();

router.post('/create', verifyToken ,CreateOrder);
router.get('/read', verifyToken, ReadOrder);
router.put('/update', UpdateOrder);
router.delete('/delete', DeleteOrder);

module.exports = router;