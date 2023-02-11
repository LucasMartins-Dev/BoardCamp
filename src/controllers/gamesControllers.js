import { connectionDB } from "../database/database.js";

export async function getGames(req,res){
    const findGame = req.query.name;
    
    try{
        
            if(findGame){
                const search = await connectionDB.query(`SELECT * FROM games WHERE name ILIKE ($1);`,[`${findGame}%`]);
                return res.status(200).send(search.rows);
            }
        const games = await connectionDB.query(`SELECT * FROM games`)
        return res.status(200).send(games.rows);
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function postGames(req,res){
    const game = res.locals.game;
    const {name, image, stockTotal, pricePerDay} = game;

    try{
        if(!name||!image||!stockTotal||!pricePerDay){
            return res.sendStatus(400);
        }
        const games = await connectionDB.query(`INSERT INTO games (name, image,"stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`,[name,image,stockTotal,pricePerDay]);  
        return res.sendStatus(201);
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}