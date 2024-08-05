const mongoose = require('mongoose');

//@Category Schema
const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        trim: true
    },
    file: {
        name: {
            type: String,
            trim: true
        },
        url: {
            type: String,
            trim: true
        }
    }
}, { timestamps: true });


//Category Model
const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;