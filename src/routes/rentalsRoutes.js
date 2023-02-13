
import { Router } from "express";
import { getRentals, postRentals, returnRental, deleteRental } from "../controllers/rentalsControllers.js";
import { rentalSchemaValidation } from "../middlewares/rentalsMiddlewares.js";
import { rentalSchema } from "../schemas/rentalsSchema.js";
import { validateSchema } from "../middlewares/validateMiddleware.js";
const route = Router();

route.get("/rentals", getRentals);
route.post("/rentals", validateSchema(rentalSchema),rentalSchemaValidation, postRentals);
route.post("/rentals/:id/return", returnRental);
route.delete("/rentals/:id", deleteRental)

export default route;