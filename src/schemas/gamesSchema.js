import Joi from "joi";

export const gameSchema = Joi.object({
    name: Joi.string().required().min(2),
    image: Joi.string().uri().required(),
    stockTotal: Joi.number().required(),
    pricePerDay: Joi.number().required(),
});