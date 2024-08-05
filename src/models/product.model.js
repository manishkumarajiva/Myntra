const mongoose = require('mongoose');

//@Product Schema
const productSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    product: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number
    },
    discount: {
        type: Number
    },
    file: [
        {
            name : {
                type : String,
                trim : true
            },
            url : {
                type : String,
                trim : true
            }
        }
    ],
    specification: [
        {
            title: {
                type: String,
                trim: true
            },
            description: {
                type: String,
                trim: true
            }
        }
    ],
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    brand : {
            name : {
                type : String,
                trim : true
            },
            logo : {
                name : {
                    type : String,
                    trim : true
                },
                url : {
                    type : String,
                    trim : true
                }
            }
    },
    stock: {
        type: Number,
        default: 1
    },
    warranty: {
        type: Number,
        default: 1
    },
    totalRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            userid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            name : {
                type : String,
                trim : true
            },
            rating: {
                type: Number,
                default: 0
            },
            comment: {
                type: String,
                trim: true
            }
        }
    ]
}, { timestamps: true });

//Product Model
const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;