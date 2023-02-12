
import { Router } from "express";
import { getGames } from "../controllers/gamesControllers.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { postGames } from "../controllers/gamesControllers.js";
import {gameSchema} from "../schemas/gamesSchema.js"
const route = Router();

route.get("/games", getGames);
route.post("/games", validate(gameSchema), postGames);

export default route;