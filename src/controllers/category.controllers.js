const CategoryModel = require('../models/category.model.js');
const { default: mongoose } = require('mongoose');
const fs = require('fs');
const msgCnfg = require('../config/config.message.js');
const categoryValidation = require('../validation/category.validation.js');



const CreateCategory = async (req, res) => {
    let filename = '';
    if (req.file) {
        if (req.file.mimetype === 'image/jpeg') {
            filename = req.file.filename;
        } else {
            return res.status(200).json({ status: 401, message: msgCnfg.imageType });
        }
    } else {
        return res.status(200).json({ status: 401, message: msgCnfg.image });
    }

    try {
        const { error, value } = categoryValidation.validate(req.body);
        if (error) {
            res.status(200).json({ status: 401, response: error.message, message: msgCnfg.payload });
        } else {
            const fileObject = new Object({
                name: filename,
                url: "http://localhost:3000/uploads/category/"
            });
            createPayload = {
                category: value.category,
                file: fileObject
            }
            const isExist = await CategoryModel.findOne({ category: { $regex: value.category, $options: 'i' } });
            if (!isExist) {
                const createResp = await CategoryModel.create(createPayload);
                if (createResp) {
                    res.status(200).json({ status: 201, response: createResp, message: msgCnfg.screate });
                } else {
                    res.status(200).json({ status: 401, response: createResp, message: msgCnfg.fcreate });
                }
            } else {
                res.status(200).json({ status: 401, message: msgCnfg.exist });
            }
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.message, message: msgCnfg.error });
    }
};



const GetCategory = async (req, res) => {
    const searchkey = req.query.searchKey;
    try {
        const getResp = await CategoryModel.find({ category: { $regex: ".*" + searchkey + ".*", $options: "i" } });
        const count = getResp.length;
        const readResp = new Object({ category : getResp, count : count});
        if (getResp.length > 0) {
            res.status(200).json({ status: 201, response: readResp, message: msgCnfg.sread });
        } else {
            res.status(200).json({ status: 401, response: getResp, message: msgCnfg.fread });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.message, message: msgCnfg.error });
    }
};



const UpdateCategory = async (req, res) => {
    const categoryid = new mongoose.Types.ObjectId(req.body.categoryId);

    let updatePayload = new Object();
    if (req.file) {
        if (req.file.mimetype === 'image/jpeg') {
            const fileObject = new Object({
                name: req.file.filename,
                url: "http://localhost:3000/uploads/category/"
            });
            updatePayload = {
                category: req.body.category,
                file: fileObject
            }
        } else {
            return res.status(200).json({ status: 401, message: msgCnfg.imageType });
        }
    } else {
        updatePayload = { category: req.body.category }
    }

    //remove previous image
    const previousImage = await CategoryModel.findById({ _id: categoryid });
    const path = `./uploads/categories/${previousImage.file.name}`;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    };

    try {
        const updateResp = await CategoryModel.findByIdAndUpdate({ _id: categoryid }, updatePayload, { new: true });
        if (updateResp) {
            res.status(200).json({ status: 201, response: updateResp, message: msgCnfg.supdate });
        } else {
            res.status(200).json({ status: 401, response: updateResp, message: msgCnfg.fupdate });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.message, message: msgCnfg.error });
    }
};



const DeleteCateogry = async (req, res) => {
    const categoryid = new mongoose.Types.ObjectId(req.query.categoryId);
    try {
        //remove previous image
        const previousImage = await CategoryModel.findById({ _id: categoryid });
        const path = `./uploads/categories/${previousImage.file.name}`;
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        };

        const deleteResp = await CategoryModel.findByIdAndDelete({ _id: categoryid });
        if (deleteResp) {
            res.status(200).json({ status: 201, response: deleteResp, message: msgCnfg.sdelete });
        } else {
            res.status(200).json({ status: 401, response: deleteResp, message: msgCnfg.fdelete });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.message, message: msgCnfg.error });
    }
};


module.exports = { CreateCategory, GetCategory, UpdateCategory, DeleteCateogry }