
import Joi from "joi";

export const rentalSchema = Joi.object({
  customerId: Joi.number().integer().required(),
  gameId: Joi.number().integer().required(),
  rentDate: Joi.date(),    
  daysRented: Joi.number(),             
  returnDate: Joi.date().allow(null),         
  originalPrice: Joi.number(),       
  delayFee: Joi.number().allow(null),
})