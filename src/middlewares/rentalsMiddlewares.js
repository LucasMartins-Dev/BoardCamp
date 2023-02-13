import { connectionDB } from "../database/database.js";
import { rentalSchema } from "../schemas/rentalsSchema.js";
import dayjs from "dayjs";

export async function rentalSchemaValidation(req, res, next){
  
    const { customerId, gameId, daysRented } =   req.body;


    try{

        const game = await connectionDB.query(`SELECT * FROM games WHERE id=$1;, [gameId]`)
        const customer = await connectionDB.query(`SELECT * FROM customers WHERE id=$1;, [customerId]`)
    if(game.rowCount === 0 || customer.rowCount === 0){
          return res.sendStatus(400)
        }

        const stockCheck = await connectionDB.query(`SELECT "stockTotal" FROM games WHERE id = $1`, [gameId]);
        const gameCheck = await connectionDB.query('SELECT * FROM rentals WHERE "gameId" = $1', [gameId])

        if (stockCheck.rows[0].stockTotal <= gameCheck.rowCount) {
            return res.status(400).send("Game is out of stock");
        }
        if(daysRented <1){
        return res.sendStatus(400);
        
    }
    const gamesAvailable = (await connectionDB.query(`SELECT "stockTotal" FROM games WHERE id=$1;`,[gameId])).rows[0].stockTotal;
    console.log(gamesAvailable,"available");
    
    const gamesRented = (await connectionDB.query(`SELECT * FROM rentals WHERE "gameId" = $1;`,[gameId])).rows.length;
    
    
    if(gamesRented >= gamesAvailable){
        return res.sendStatus(400);
        
    }
    
    const getPrice = (await connectionDB.query(`SELECT "pricePerDay" FROM games WHERE id = $1;`,[gameId])).rows[0].pricePerDay;
    const rentDate = dayjs().format(`YYYY/MM/DD`);
    const returnDate = null;
    const originalPrice = Number(getPrice)*Number(daysRented);
    const delayFee = null;
    
    const rentalObject = {
        
        customerId,
        gameId,
        rentDate,   
        daysRented,             
        returnDate,         
        originalPrice,       
        delayFee             
        
    }
    
    const {error} = rentalSchema.validate(rentalObject, {abortEarly:false});
    if(error){
        console.log(findC, "customerrr");
        
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(errors);
    }
    
    res.locals.rentalObj = rentalObject;
    next();
}catch(err){
    console.log(err);
    return res.sendStatus(500);
}
}