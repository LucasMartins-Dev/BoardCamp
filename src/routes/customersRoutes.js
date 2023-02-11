import { Router } from "express";
import { getCustomers, postCustomers, getCustomersById, updateCustomers } from "../controllers/customersControllers.js";
import { customerSchemaValidation } from "../middlewares/customersMiddlewares.js";

const route = Router();

route.get("/customers", getCustomers);
route.get("/customers/:id", getCustomersById);
route.post("/customers", customerSchemaValidation, postCustomers)
route.put("/customers/:id", customerSchemaValidation, updateCustomers);

export default route;