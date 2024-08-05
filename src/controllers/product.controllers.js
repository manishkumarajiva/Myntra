const ProductModel = require("../models/product.model.js");
const msgCnfg = require("../config/config.message.js");
const { default: mongoose } = require("mongoose");
const productValidation = require("../validation/product.validation.js");
const fs = require('fs');



const CreateProduct = async (req, res) => {

    try {
        const { error, value } = productValidation.validate(req.body);
        if (error) {
            return res.status(200).json({ status: 401, response: error.message, message: msgCnfg.payload });
        } else {

            let images = [];
            for (var i = 0; i < req.files["file"].length; i++) {
                images.push({
                    name: req.files["file"][i].filename,
                    url: 'http://localhost:3000/uploads/products/'
                });
            };

            let brandObject = new Object({
                name: value.brandName,
                logo: {
                    name: req.files["brandLogo"][0].filename,
                    url: 'http://localhost:3000/uploads/logo/'
                }
            });

            let spec = [];
            req.body.specification.forEach(currEle => {
                spec.push(JSON.parse(currEle))
            })


            const createPayload = {
                product: value.product,
                description: value.description,
                price: value.price,
                discount: value.discount,
                stock: value.stock,
                warrenty: value.warrenty,
                categoryId: new mongoose.Types.ObjectId(value.categoryId),
                specification: spec,
                file: images,
                brand: brandObject
            };

            const productExist = await ProductModel.findOne({ product: { $regex: value.product, $options: 'i' } });
            if (!productExist) {
                const createResp = await ProductModel.create(createPayload);
                if (createResp) {
                    return res.status(200).json({ status: 201, response: createResp, message: msgCnfg.screate });
                } else {
                    return res.status(200).json({ status: 401, response: createResp, message: msgCnfg.fcreate });
                }
            } else {
                return res.status(200).json({ status: 401, message: msgCnfg.exist });
            }
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.error });
    }
};



const ReadProduct = async (req, res) => {
    const searchkey = req.query.searchKey;
    let skip = 0;
    const limit = Number(req.query.limit) || 20;
    (Number(req.query.skip) === 0) ? skip = 1 : skip = req.query.skip;    

    try {
        const getResp = await ProductModel.find({ product: { $regex: ".*" + searchkey + ".*", $options: "i" } }).skip((skip - 1)*limit).limit(limit);
        const count = getResp.length;
        const totalProduct = await ProductModel.countDocuments();
        const pagination = Math.ceil(totalProduct/limit);
        const readResp = new Object({ product : getResp, count : count, pagination : pagination, totalProduct : totalProduct });
        if (getResp.length > 0) {
            return res.status(200).json({ status: 201, response: readResp, message: msgCnfg.sread });
        } else {
            return res.status(200).json({ status: 401, response: readResp, message: msgCnfg.fread });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.message, message: msgCnfg.error });
    }
};



const UpdateProduct = async (req, res) => {
    const productid = new mongoose.Types.ObjectId(req.query.productId);
    let images = [];
    let updatePayload = new Object();
    

    try {
        const { error, value } = productValidation.validate(req.body, req.files["brandLogo"]);

        if (error) {
            return res.status(200).json({ status: 401, response: error.message, message: msgCnfg.payload });
        } else {
            const product = await ProductModel.findById({ _id: productid });
            if (req.files["file"]) {
                for (var i = 0; i < (product.file).length; i++) {
                    const filePath = `./uploads/products/${product.file[i].name}`;
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath)
                    }
                }

                for (var i = 0; i < (req.files["file"]).length; i++) {
                    images.push({
                        name: req.files["file"][i].filename,
                        url: `http://localhost:3000/uploads/products/`
                    })
                }
            }


            if (req.files["brandLogo"]) {
                const logoPath = `./uploads/logo/${product.brand.logo.name}`;
                if (fs.existsSync(logoPath)) {
                    fs.unlinkSync(logoPath)
                }
            }

            const brandObject = new Object({
                name: value.brandName,
                logo: {
                    name: req.files["brandLogo"][0].filename,
                    url: 'http://localhost:3000/uploads/logo/'
                }
            });


            const spec = new Array();
            value.specification.forEach(currEle => {
                spec.push(JSON.parse(currEle));
            });

            if (req.files["file"] && req.files["brandLogo"]) {
                updatePayload = {
                    product: value.product,
                    description: value.description,
                    price: value.price,
                    discount: value.discount,
                    stock: value.stock,
                    warrenty: value.warrenty,
                    categoryId: new mongoose.Types.ObjectId(productid),
                    specification: spec,
                    file: images,
                    brand: brandObject
                };
            };

            const updateResp = await ProductModel.findByIdAndUpdate({ _id: productid }, updatePayload, { new: true });
            if (updateResp) {
                return res.status(200).json({ status: 201, response: updateResp, message: msgCnfg.supdate });
            } else {
                return res.status(200).json({ status: 401, response: updateResp, message: msgCnfg.fupdate });
            }
        }

    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.error });
    }
};



const DeleteProduct = async (req, res) => {
    const productid = new mongoose.Types.ObjectId(req.query.productid);
    try {
        const product = await ProductModel.findById({ _id: productid });
        const logoPath = `./uploads/logo/${product.brand.logo.name}`;
        if (fs.existsSync(logoPath)) {
            fs.unlinkSync(logoPath)
        }

        for (var i = 0; i < (product.file).length; i++) {
            const filePath = `./uploads/products/${product.file[i].name}`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        const deleteResp = await ProductModel.findByIdAndDelete({ _id: productid });
        if (deleteResp) {
            return res.status(200).json({ status: 201, response: deleteResp, message: msgCnfg.sdelete });
        } else {
            return res.status(200).json({ status: 401, response: deleteResp, message: msgCnfg.fdelete });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.message, message: msgCnfg.error });
    }
};


// ---------------------- Reviews --------------------- //

const CreateOrUpdateReview = async (req, res) => {
    const productid = new mongoose.Types.ObjectId(req.body.productId);
    const { rating, comment } = req.body;
    try {
        isProduct = await ProductModel.findById({ _id: productid });
        if (!isProduct) {
            return res.status(200).json({ status: 401, message: msgCnfg.notFound });
        } else {
            let reviewPayload = {
                userid: req._id,
                name: req.role.name,
                rating: rating,
                comment: comment
            }
            let isReviewed = await isProduct.reviews.find(review => review.userid.toString() === req._id.toString());

            if (isReviewed) {
                isProduct.reviews.forEach(review => {
                    if (review.userid.toString() === req._id.toString()) {
                        review.rating = Number(rating),
                            review.comment = comment
                    }
                })
            } else {
                isProduct.reviews.push(reviewPayload);
            }

            isProduct.totalReviews = isProduct.reviews.length;
            let totalRatings = 0;

            isProduct.reviews.forEach(review => totalRatings += review.rating);
            isProduct.totalRating = (totalRatings / isProduct.reviews.length);
            const createResp = await isProduct.save({ new: true });
            res.status(200).json({ status: 201, response: createResp, message: msgCnfg.screate });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.error });
    }
};



const ReadReviews = async (req, res) => {
    const productid = new mongoose.Types.ObjectId(req.query.productId);
    try {
        const productResp = await ProductModel.findById({ _id: productid });
        if (productResp) {
            return res.status(200).json({ status: 201, response: productResp.reviews, message: msgCnfg.sread });
        } else {
            return res.status(200).json({ status: 201, response: productResp.reviews, message: msgCnfg.fread });
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.error });
    }
};



const DeleteReviews = async (req, res) => {
    const productid = new mongoose.Types.ObjectId(req.query.productId);
    try {
        const isProduct = await ProductModel.findById({ _id: productid });
        if (!isProduct) {
            return res.status(200).json({ status: 401, message: msgCnfg.notFound });
        } else {
            const reviews = isProduct.reviews.filter(review => review._id.toString() !== req.query.reviewId.toString());
            let totalRatings = 0;
            reviews.forEach(review => totalRatings += review.rating);
            isProduct.totalRating = (totalRatings / reviews.length);
            isProduct.totalReviews = reviews.length;
            isProduct.reviews = reviews;

            const deleteResp = await ProductModel.findByIdAndUpdate({ _id: productid }, isProduct, { new: true });

            if (deleteResp) {
                return res.status(200).json({ status: 201, response: deleteResp, message: msgCnfg.sdelete });
            } else {
                return res.status(200).json({ status: 401, response: deleteResp, message: msgCnfg.fdelete });
            }
        }
    } catch (err) {
        res.status(400).json({ status: 400, response: err.stack, message: msgCnfg.error });
    }
}


module.exports = { CreateProduct, ReadProduct, UpdateProduct, DeleteProduct, CreateOrUpdateReview, ReadReviews, DeleteReviews }