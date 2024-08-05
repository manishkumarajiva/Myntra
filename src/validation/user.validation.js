const joi = require('joi');

const createUserValidation = new joi.object({
    name : joi.string().required(),
    gender : joi.string().required(),
    mobile : joi.number().required(),
    email : joi.string().required(),
    password : joi.string().required(),
    isAdmin : joi.boolean().default(false)
});


const loginUserValidation = new joi.object({
    email : joi.required(),
    password : joi.required()
});

module.exports = {createUserValidation, loginUserValidation};