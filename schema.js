const Joi = require("joi");

const listingSchema = Joi.object({
    listing : ({
        title : Joi.string().required(),
        description : Joi.string().required(),
         location : Joi.string().required(),
         country : Joi.string().required(),
         price : Joi.number().required().min(0),
         image : Joi.string().allow("",null)
    })
});

module.exports = listingSchema;