
import gamesRoutes from "./routes/gamesRoutes.js";


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(gamesRoutes);



app.listen(process.env.PORT, () => console.log(`Server running`));