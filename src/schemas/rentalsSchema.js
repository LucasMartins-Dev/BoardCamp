
import Joi from "joi";

export const rentalSchema = Joi.object({
    customerId: Joi.number(),
  gameId: Joi.number(),
  rentDate: Joi.date(),    
  daysRented: Joi.number(),             
  returnDate: Joi.date().allow(null),         
  originalPrice: Joi.number(),       
  delayFee: Joi.number().allow(null),
})