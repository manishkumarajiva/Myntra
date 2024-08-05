const express = require('express');
const { CreateCategory, GetCategory, UpdateCategory, DeleteCateogry } = require('../../controllers/category.controllers.js');
const { verifyAdmin } = require('../../middlewares/auth.role.js');
const { Uploader } = require('../../middlewares/auth.upload.js');

const router = express.Router();

router.post('/create', verifyAdmin, Uploader("categories"), CreateCategory);
router.get('/read', GetCategory);
router.put('/update', verifyAdmin, Uploader("categories"), UpdateCategory);
router.delete('/delete', verifyAdmin, Uploader("categories"), DeleteCateogry);

module.exports = router;