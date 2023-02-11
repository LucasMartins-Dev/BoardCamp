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
    const {name, stockTotal, pricePerDay, image} = game;

    try{
        const games = await connectionDB.query(`INSERT INTO games (name,"stockTotal", "pricePerDay", image) VALUES ($1, $2, $3, $4);`,[name,stockTotal,pricePerDay,image]);  
        return res.sendStatus(201);
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}