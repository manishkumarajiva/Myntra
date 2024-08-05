const express = require("express");
const { CreateCart, ReadCart, UpdateCart, DeleteCart } = require("../../controllers/cart.controllers.js");
const { verifyToken } = require("../../middlewares/auth.token.js");

// ------------- REST API -------------
const router = express.Router();

router.post('/create', verifyToken, CreateCart);
router.get('/read', verifyToken, ReadCart);
router.put('/update', verifyToken, UpdateCart);
router.delete('/delete', verifyToken, DeleteCart);

module.exports = router;
