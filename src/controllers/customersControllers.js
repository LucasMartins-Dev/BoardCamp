import { connectionDB } from "../database/database.js";

export async function getCustomers(req, res){
    const find = req.query.cpf

    
    try{
        if(find){
            const search = await connectionDB.query(`SELECT * FROM customers WHERE cpf ILIKE ($1);`,[find])
            return res.status(200).send(search.rows);
        }
        const customers = await connectionDB.query(`Select * FROM customers`);
        return res.status(200).send(customers.rows);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}
export async function getCustomersById(req, res){


    try{
        const find = Number(req.params.id);
        if(find){
            
            const search = await connectionDB.query(`SELECT * FROM customers WHERE id=($1);`,[find])
            
            if(search.rows.length===0){
                return res.sendStatus(404);
            }
            return res.status(200).send(search.rows);
        }
        
            }catch(err){
                console.log(err);
                return res.sendStatus(500);
            }
}
export async function postCustomers(req, res){
    const customer = res.locals.customer;
    const {name, phone, cpf, birthday} = customer;
    try{
     
        const games = await connectionDB.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,[name, phone, cpf, birthday]);  
        return res.sendStatus(201);
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function updateCustomers(req, res){
    const id = req.params.id;
    const customer = res.locals.customer;
    const {name, phone, cpf, birthday} = customer;
    try{


        await connectionDB.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`,[`${name}`,phone,cpf,birthday,id])
        return res.sendStatus(200);
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }

}