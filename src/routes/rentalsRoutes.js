
import { Router } from "express";
import { getRentals, postRentals, returnRental, deleteRental } from "../controllers/rentalsControllers.js";
import { rentalSchemaValidation } from "../middlewares/rentalsMiddlewares.js";

const route = Router();

route.get("/rentals", getRentals);
route.post("/rentals", rentalSchemaValidation, postRentals);
route.post("/rentals/:id/return", returnRental);
route.delete("/rentals/:id", deleteRental)

export default route;