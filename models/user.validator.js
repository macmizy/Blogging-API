const Joi = require('joi')

const userValidator = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    first_name: Joi.string()
        .min(3)
        .max(255)
        .required(),

    last_name: Joi.string()
        .min(3)
        .max(255)
        .required(),

    password: Joi.string()
        .min(5)
        .max(13)
        .required()

})

const validateUser = async (req, res, next) => {
    const UserPayload = req.body;
    try {
        await userValidator.validateAsync(UserPayload);
        next();
    } catch (error) {
        console.log(error);
        return res.status(406).send(error.details[0].message);
    }

}

module.exports = validateUser