const Joi = require('joi')

const blogvalidator = Joi.object({
    title: Joi.string()
        .min(5)
        .max(255)
        .required(),

    description: Joi.string()
        .min(5)
        .max(255)
        .required(),

    body: Joi.string()
        .min(5)
        .max(500)
        .required(),

    tags: Joi.string()
        .optional(),

    timestamp: Joi.date()
        .default(Date.now()),

    state: Joi.string()
        .default('draft')
        .optional(),

    author: Joi.string()
        .optional(),

    })

const validateblog = async (req,res,next)=>{
    bodyPayload = req.body

    try{
        await blogvalidator.validateAsync(bodyPayload)
        next()
    }catch(error){
        console.log(error);
        return res.status(406).send(error.details[0].message);
    }
}

module.exports = validateblog