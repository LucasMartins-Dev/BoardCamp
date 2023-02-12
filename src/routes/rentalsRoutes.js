
import { Router } from "express";
import { getRentals, postRentals, returnRental, deleteRental } from "../controllers/rentalsControllers.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {rentalSchema} from "../schemas/rentalsSchema.js"

const route = Router();

route.get("/rentals", getRentals);
route.post("/rentals", validate(rentalSchema), postRentals);
route.post("/rentals/:id/return", returnRental);
route.delete("/rentals/:id", deleteRental)

export default route;