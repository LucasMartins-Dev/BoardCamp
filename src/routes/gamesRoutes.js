
import { Router } from "express";
import { getGames } from "../controllers/gamesControllers.js";
import { gameSchemaValidation } from "../middlewares/gamesMiddlewares.js";
import { postGames } from "../controllers/gamesControllers.js";
const route = Router();

route.get("/games", getGames);
route.post("/games", gameSchemaValidation, postGames);

export default route;