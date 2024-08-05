const joi = require("joi");

const productValidation = joi.object({
    // createdBy : joi.string().required(),
    product: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().min(100).required(),
    discount: joi.number().min(5).max(50).required(),
    stock: joi.number().min(1).required(),
    warrenty: joi.string().min(1).max(5).required(),
    totalRating: joi.number().default(0),
    totalReviews: joi.number().default(0),
    categoryId: joi.string().required(),
    specification: joi.array().min(2).message("Please, write at least 2 specifications").required(),
    brandName: joi.string().required()
});
// unknown(true)
module.exports = productValidation;


// brandLogo: joi.array().length(1).required().pattern(new RegExp()),
// file: joi.array().items({ name: joi.string().required() }).min(3).required()

// review : joi.array().when("product", {is : "",then : joi.required(), otherwise : joi.optional()})
//.valid('car','jeep')
// joi.object().keys({
//     id: joi.number(),
//     name: joi.required()
// })

// array of joi.object
// array : joi.array().items(joi.object().keys({ id : joi.number().required()}));
// cpassword : joi.string().valid(joi.ref('password')).required()

//limit = 2 ? array == 2
// array : joi.array().min(joi.ref("limit"))
// email : joi.string().email({ minDomainSegments : 2, tlds : {allow:['com','in']}})
// ).xor{"fullname", "lastname"}
// name : joi.string().custom((value,message) => {
//     if(value === "admin"){
//         return message.message("Admin or admin not allowed") // business logic
//     }
// })

