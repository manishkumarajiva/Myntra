const mongoose = require("mongoose");

// @Schema for Cart Items
const cartSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product"
    },
    quantity : {
        type : Number,
        default : 1
    }
});

// Cart's Model
const CartModel = new mongoose.model("Cart", cartSchema);
module.exports = CartModel;