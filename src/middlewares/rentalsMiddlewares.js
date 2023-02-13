import { connectionDB   } from "../database/database.js";
import { rentalSchema } from "../schemas/rentalsSchema.js";
import dayjs from "dayjs";

export async function rentalSchemaValidation(req, res, next){
  
    const { customerId, gameId } = req.body;
  try {
    const { rowCount: gameCount } = await connectionDB .query(
      `SELECT * FROM games WHERE id = $1`,
      [gameId]
    );

    if (gameCount === 0) return res.sendStatus(400);

    const { rowCount: customerCount } = await connectionDB .query(
      `SELECT * FROM customers WHERE id = $1`,
      [customerId]
    );

    if (customerCount === 0) return res.sendStatus(400);

    const game = await connectionDB .query(
      `SELECT "stockTotal", COUNT(rentals.id) as "rented" FROM games
       LEFT JOIN rentals ON games.id = rentals."gameId"
       WHERE games.id = $1
       GROUP BY games.id`,
      [gameId]
    );

    if (!game.rows[0] || game.rows[0].stockTotal <= game.rows[0].rented) return res.sendStatus(400);

    next();
  } catch (err) {
    res.status(500).send(err);
  }
};

