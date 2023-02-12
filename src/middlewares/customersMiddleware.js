import { customerSchema } from "../schemas/customersSchema.js";
import { connectionDB } from "../database/database.js";

export async function customerSchemaValidation(req, res, next){
    const customer = req.body;
    const { id,name, phone, cpf, birthday} = customer;
    


    try{

        const { error } = customerSchema.validate(customer, { abordEarly: false});
        if(error){
            const errors = error.details.map((detail) => detail.message);
            return res.status(400).send(errors);
        }
       
        res.locals.customer = customer;
        next();
        
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}