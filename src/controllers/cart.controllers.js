const CartModel = require('../models/cart.model.js');
const msgCnfg = require('../config/config.message.js');
const { default : mongoose } = require('mongoose');

const CreateCart = async (req,res) => {
    const userid = new mongoose.Types.ObjectId(req.role._id);
    const productid = new mongoose.Types.ObjectId(req.body.productId);
    try{
        const createPayload = {
            userId : userid,
            productId : productid,
            quantity : req.body.quantity
        };
        const createResp = await CartModel.create(createPayload);
        if (createResp) {
            return res.status(200).json({ status: 201, response: createResp, message: msgCnfg.screate });
        } else {
            return res.status(200).json({ status: 401, response: createResp, message: msgCnfg.fcreate });
        }
    }catch(err){
        res.status(400).json({status : 400, response : err.stack, message : msgCnfg.error});
    }
};



const ReadCart = async (req,res) => {
    let readResp = new Array();
    const cartid = new mongoose.Types.ObjectId(req.query.cartId);

    try{
        const userid = new mongoose.Types.ObjectId(req.role._id);
        if(req.query.cartId){
            readResp = await CartModel.find({_id : cartid}).populate("productId");
        }else{
            readResp = await CartModel.find().populate("productId");
        }

        if (readResp.length > 0) {
            return res.status(200).json({ status: 201, response: readResp, message: msgCnfg.sread });
        } else {
            return res.status(200).json({ status: 401, response: readResp, message: msgCnfg.fread });
        }
    }catch(err){
        res.status(400).json({status : 400, response : err.stack, message : msgCnfg.error});
    }
};



const UpdateCart = async (req,res) => {

    const userid = new mongoose.Types.ObjectId(req.role._id);
    const cartid = new mongoose.Types.ObjectId(req.body.cartId);

    try{
        const updatePayload = {
            quantity : req.body.quantity 
        }
        const updateResp = await CartModel.findByIdAndUpdate({_id : cartid}, updatePayload, {new : true});
        if (updateResp) {
            return res.status(200).json({ status: 201, response: updateResp, message: msgCnfg.screate });
        } else {
            return res.status(200).json({ status: 401, response: updateResp, message: msgCnfg.fcreate });
        }
    }catch(err){
        res.status(400).json({status : 400, response : err.stack, message : msgCnfg.error});
    }
};



const DeleteCart = async (req,res) => {
    const cartid = new mongoose.Types.ObjectId(req.query.cartId);
    try{
        const deleteResp = await CartModel.findByIdAndDelete({_id : cartid});
        if(deleteResp){
            return res.status(200).json({status : 201, response : deleteResp, message : msgCnfg.sdelete});
        }else{
            return res.status(200).json({status : 401, response : deleteResp, message : msgCnfg.fdelete});
        }
    }catch(err){
        res.status(400).json({status : 400, response : err.stack, message : msgCnfg.err});
    }
};



module.exports = { CreateCart, ReadCart, UpdateCart, DeleteCart }