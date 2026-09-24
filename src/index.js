import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

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

//Error handling middleware

//Server Running
console.log("PORT:", process.env.PORT);
app.listen(port, ()=>{
    console.log(`server running on http://localhost:${port}`)
});