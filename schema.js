//server site validation ar jonno
const Joi = require('joi');

module.exports.listingSchema=Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),//jata price ar value negative na hoy tai min(0) kora6i
        image: Joi.string().allow("",null) //mana image ar modha emtey string and null value o hota para
    }).required(),
});

//Review ar jonno validation
module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required(),
 });