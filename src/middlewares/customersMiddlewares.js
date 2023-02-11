import { customerSchema } from "../schemas/customersSchema.js";
import { connectionDB } from "../database/database.js";

export async function customerSchemaValidation(req, res, next){
    const customer = req.body;

    


    try{

        const { error } = customerSchema.validate(customer, { abordEarly: false});
        if(error){
            const errors = error.details.map((detail) => detail.message);
            return res.status(400).send(errors);
        }
        const customerExists = await connectionDB.query(`SELECT cpf FROM customers WHERE name = $1;`,[customer.cpf]);
        if(customerExists.rowCount > 0){
            return res.status(409).send("Este cliente já existe");
        }
        
        res.locals.customer = customer;
        next();
        
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}