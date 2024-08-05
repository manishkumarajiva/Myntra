const OrderModel = require('../models/order.model.js');
const ProductModel = require('../models/product.model.js');
const msgCnfg = require('../config/config.message.js');
const { default: mongoose } = require('mongoose');
const sendEmail = require('../utils/email.utils.js');



const CreateOrder = async (req, res) => {
    const { shippingInfo, payment, orderItems } = req.body;

    try {
        const userid = new mongoose.Types.ObjectId(req.role._id);
        const existOrders = await OrderModel.find({ userId: userid });


        if (existOrders.length > 0) {
            existOrders.forEach((currOrder) => {
                currOrder.orderItems.find((currProduct) => {
                    for (let i = 0; i < orderItems.length; i++) {
                        if (currProduct.productId.equals(orderItems[i].productId)
                            &&
                            (currProduct.orderStatus === "processing" || currProduct.orderStatus === "shipped")) {
                            return res.status(200).json({ status: 401, message: "Order Already Placed" });
                        }
                    }
                });
            });
        } else {
            const createPayload = {
                userId: userid,
                shippingInfo: shippingInfo,
                orderItems: orderItems,
                payment: payment,
                paidAt: Date.now(),
                orderStatus: req.body.orderStatus,
                deliveredAt: req.body.deliveredAt,
                dispatchAt: req.body.dispatchAt,
                totalPrice: req.body.totalPrice || 2
            };
            const createResp = await OrderModel.create(createPayload);
            if (createResp) {
                await sendEmail({
                    subject : `Order ${msgCnfg.screate}`,
                    html : `Customer : ${req.role.name} <br> Email : ${req.role.email} <br> Product : ${createResp.orderItems} <br> Details : ${createResp.shippingInfo}`
                })
                return res.status(200).json({ status: 201, response: createResp, message: msgCnfg.screate });
            } else {
                return res.status(200).json({ status: 401, response: createResp, message: msgCnfg.fcreate });
            }
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.error });
    }
};



const ReadOrder = async (req, res) => {
    let readResp = new Array();
    try {
        if (req.query.orderId) {
            const orderid = new mongoose.Types.ObjectId(req.query.orderId);
            readResp = await OrderModel.find({ _id: orderid }).populate("userId");
        } else {
            readResp = await OrderModel.find({ userId: req.role._id })
                .populate("userId")
                .populate({
                    path: "orderItems.productId",
                    model: "Product",
                    populate: {
                        path: "categoryId",
                        model: "Category"
                    }
                });
        }

        if (readResp.length > 0) {
            return res.status(200).json({ status: 201, response: readResp, message: msgCnfg.sread });
        } else {
            return res.status(200).json({ status: 401, response: readResp, message: msgCnfg.fread });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.error });
    }
};



const UpdateOrder = async (req, res) => {
    const orderid = new mongoose.Schema.Types.ObjectId(req.query.orderId);
    try {
        const isOrder = await OrderModel.findById({ _id: orderid });
        if (!isOrder) {
            return res.status(200).json({ status: 401, message: msgCnfg.exist });
        } else if (isOrder.orderStatus === "delivered") {
            return res.status(200).json({ status: 401, message: "Order Already Delivered" });
        } else if (req.body.orderStatus === "shipped") {
            isOrder.orderStatus = "shipped",
                isOrder.shippedAt = Date.now(),
                isOrder.orderItems.forEach(async (currEle) => {
                    const { productId, quantity } = currEle;
                    await updateProductQtyStock(productId, quantity);
                })
        } else if (req.body.orderStatus === "delivered") {
            isOrder.orderStatus = "shipped",
                isOrder.deliveredAt = Date.now()
        }

        const updateResp = await isOrder.save({ new: true });
        if (updateResp) {
            return res.status(200).json({ status: 201, response: updateResp, message: msgCnfg.supdate });
        } else {
            return res.status(200).json({ status: 401, response: updateResp, message: msgCnfg.fupdate });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.error });
    }
};



// Update Product Quantity in Stock (Product Model)
async function updateProductQtyStock(productid, quantity) {
    const product = await ProductModel.findById({ _id: productid });
    product.quantity -= quantity;
    await product.save();
};



const DeleteOrder = async (req, res) => {
    const orderid = new mongoose.Types.ObjectId(req.query.orderId);
    try {
        const readResp = await OrderModel.findByIdAndDelete({ _id: orderid });
        if (readResp) {
            return res.status(200).json({ status: 201, response: readResp, message: msgCnfg.sdelete });
        } else {
            return res.status(200).json({ status: 401, response: readResp, message: msgCnfg.fdelete });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.error });
    }
};


module.exports = { CreateOrder, ReadOrder, UpdateOrder, DeleteOrder };


