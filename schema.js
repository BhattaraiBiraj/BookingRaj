const Joi = require("joi");

const listingSchema = Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
         location : Joi.string().required(),
         country : Joi.string().required(),
         price : Joi.number().required().min(0),
         image : Joi.string().allow("",null)
}).required();

const reviewSchema = Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(), 
});

module.exports = {listingSchema, reviewSchema};
