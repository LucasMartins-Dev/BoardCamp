import { gameSchema } from "../schemas/gamesSchema.js";
import { connectionDB } from "../database/database.js";

export async function gameSchemaValidation(req, res, next){
    const game = req.body;


    try{
        if(!game.name || game.name == ""){
            return res.sendStatus(400);
        }
        if(game.stockTotal <1 || !game.stockTotal){
            return res.sendStatus(400);
        }
        if(game.pricePerDay <1 || !game.pricePerDay){
            return res.sendStatus(400);
        }
        const { error } = gameSchema.validate(game, { abortEarly: false});
        if(error){
            const errors = error.details.map((detail) => detail.message);
            return res.status(400).send(errors);
        }
        
        const gameExists = await connectionDB.query(`SELECT name FROM games WHERE name = $1;`,[game.name]);
        if(gameExists.rowCount > 0){
            return res.status(409).send("Este jogo já existe");
        }
        
        res.locals.game = game;
        next();
        
            }catch(err){
                console.log(err);
                return res.sendStatus(500);
            }
}