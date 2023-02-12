import { Router } from "express";
import { getCustomers, postCustomers, getCustomersById, updateCustomers } from "../controllers/customersControllers.js";
import { validate } from "../middlewares/validateMiddleware.js";

const route = Router();

route.get("/customers", getCustomers);
route.get("/customers/:id", getCustomersById);
route.post("/customers", validate, postCustomers)
route.put("/customers/:id", validate, updateCustomers);

export default route;