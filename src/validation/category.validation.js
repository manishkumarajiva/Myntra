const joi = require('joi');

const categoryValidation = new joi.object({
    category : joi.string().required()
});

module.exports = categoryValidation;