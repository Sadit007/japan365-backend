import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from './routes/categoryRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import errorHandling from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

//MiddleWares
app.use(express.json());
app.use(cors());

//test DB connection
app.get("/", async(req, res)=>{
    const result = await pool.query("SELECT current_database()");
    res.send(`Database name is: ${result.rows[0].current_database}`);
})

//Routes
app.use("/api/", userRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', brandRoutes);
app.use('/api', locationRoutes);
app.use('/api', inventoryRoutes);

//Error handling middleware
app.use(errorHandling);

//Server Running
console.log("PORT:", process.env.PORT);
app.listen(port, ()=>{
    console.log(`server running on http://localhost:${port}`)
});