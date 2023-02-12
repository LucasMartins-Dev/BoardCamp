import { Router } from "express";
import { getCustomers, postCustomers, getCustomersById, updateCustomers } from "../controllers/customersControllers.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { customerSchema } from "../schemas/customersSchema.js";
const route = Router();

route.get("/customers", getCustomers);
route.get("/customers/:id", getCustomersById);
route.post("/customers", validate(customerSchema), postCustomers)
route.put("/customers/:id", validate(customerSchema), updateCustomers);

export default route;