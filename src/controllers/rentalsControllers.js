import { connectionDB } from "../database/database.js";
import dayjs from "dayjs";

export async function getRentals(req, res){
    const findCustomer = req.query.customerId;
    const findGame = req.query.gameId;
    try{
       
        const allRentals = await connectionDB.query(`
        SELECT json_build_object(
            'id', rentals.id,
            'customerId', rentals."customerId",
            'gameId', rentals."gameId",
            'rentDate', rentals."rentDate",
            'daysRented', rentals."daysRented",
            'returnDate', rentals."returnDate",
            'originalPrice', rentals."originalPrice",
            'delayFee', rentals."delayFee",
            'customer', json_build_object(
                'id', customers.id,
                'name', customers.name
            ),
            'game', json_build_object(
                'id', games.id,
                'name', games.name
            )
        )
        FROM rentals
        JOIN customers
            ON rentals."customerId" = customers.id
        JOIN games
            ON rentals."gameId" = games.id;
    `)
        res.send(allRentals.rows.map((r) => r.json_build_object))

        
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}


export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const rentalDate = dayjs(Date.now()).format("YYYY-MM-DD");

    try {

        const customerDuplicate = await connectionDB.query(`SELECT * FROM customers WHERE id = $1`, [customerId]);
        const gameDuplicate = await connectionDB.query(`SELECT * FROM games WHERE id = $1`, [gameId]);

        if (!customerDuplicate.rowCount || !gameDuplicate.rowCount) {
            return res.sendStatus(400);
        }

        const stockCheck = await connectionDB.query(`SELECT "stockTotal" FROM games WHERE id = $1`, [gameId]);
        const gameCheck = await connectionDB.query('SELECT * FROM rentals WHERE "gameId" = $1', [gameId])

        if (stockCheck.rows[0].stockTotal <= gameCheck.rowCount) {
            return res.status(400).send("Game is out of stock");
        }

        const rentedGame = await connectionDB.query("SELECT * FROM games WHERE id = $1", [gameId]);
        const { pricePerDay } = rentedGame.rows[0]
        const originalPrice = daysRented * pricePerDay

        await connectionDB.query(
            `INSERT INTO rentals 
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
            [customerId, gameId, rentalDate, daysRented, null, originalPrice, null])
        res.status(201).send("Rental added successfully");
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function returnRental(req, res){
    const id = req.params.id;
    try{
        const rental = await connectionDB.query(`SELECT * FROM rentals WHERE id=$1;`,[id]);
        if(!rental || rental.rowCount<1){
            return res.sendStatus(404);
        }
        if(rental.rows[0].returnDate){
            return res.sendStatus(400);
        }
        const {customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee} = rental.rows[0];
        const newReturnDate = dayjs().format(`YYYY/MM/DD`);

        const timeRented = dayjs().diff(rentDate, 'day');
       let newDelayFee = null;
        if(timeRented>daysRented){
            
           const dailyPrice = Math.trunc(originalPrice/daysRented);
           const pastDate = timeRented - daysRented;
           newDelayFee = dailyPrice*pastDate;
        }

        await connectionDB.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;`,[newReturnDate, newDelayFee, id]);
        return res.sendStatus(200)

    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }

}

export async function deleteRental(req, res){
    const id = req.params.id;
    try{
        const rental = await connectionDB.query(`SELECT * FROM rentals WHERE id=$1;`,[id]);
        if(!rental || rental.rowCount<1){
            return res.sendStatus(404);
        }
        if(!rental.rows[0].returnDate){
            return res.sendStatus(400);
        }
        await connectionDB.query(`DELETE FROM rentals WHERE id=$1;`,[id]);
        return res.sendStatus(200);
        
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}