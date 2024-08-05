const express = require('express');
const { CreateProduct, ReadProduct, UpdateProduct, DeleteProduct } = require('../../controllers/product.controllers.js');
const { CreateOrUpdateReview, ReadReviews, DeleteReviews } = require('../../controllers/product.controllers.js');
const { verifyAdmin, verifyUser } = require('../../middlewares/auth.role.js');
const { upload } = require('../../middlewares/auth.upload.js');
const { verifyToken } = require('../../middlewares/auth.token.js');
// ------------ REST API -----------
const router = express.Router();

router.post('/create', upload, CreateProduct);
router.get('/read', ReadProduct);
router.put('/update', upload, UpdateProduct);
router.delete('/delete',DeleteProduct);

router.put('/review', verifyToken, verifyUser, CreateOrUpdateReview);
router.get('/review', verifyUser, ReadReviews);
router.delete('/review',verifyUser, DeleteReviews);


module.exports = router;

