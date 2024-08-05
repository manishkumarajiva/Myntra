const express = require('express');
const adminRoutes = require('./admin.routes.js');
const usersRoutes = require('./user.routes.js');
const categoriesRoute = require('./category.routes.js');
const productsRoutes = require('./product.routes.js');
const ordersRoutes = require('./order.routes.js');
const cartRoutes = require('./cart.routes.js');


//REST API ------ ROUTES INDEX ----------
const router = express.Router();

router.use('/admin',adminRoutes);
router.use('/user',usersRoutes);
router.use('/category',categoriesRoute);
router.use('/product',productsRoutes);
router.use('/cart', cartRoutes);
router.use('/order', ordersRoutes);



module.exports = router;
