const mongoose = require('mongoose');

//@Order Schema
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    shippingInfo: {
        address: {
            type: String,
            trim: true,
            required: true
        },
        country: {
            type: String,
            trim: true,
            required: true
        },
        state: {
            type: String,
            trim: true,
            required: true
        },
        city: {
            type: String,
            trim: true,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        }
    },
    orderItems: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    payment: {
        paymentId: {
            type: String,
            trim: true
        },
        status: {
            type: Boolean,
            default : false
        }
    },
    paidAt: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        trim: true,
        default: "processing",
        enum: ['processing', 'shipped', 'delivered']
    },
    deliveredAt: {
        type: Date
    },
    shippedAt: {
        type: Date
    }
},{timestamps : true});


//Order Model
const OrderModel = mongoose.model("Order", orderSchema);
module.exports = OrderModel;


