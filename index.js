import express, { urlencoded } from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import connectDb from '../my-server/public/db.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import app from "./app.js"



// console.log("filename",staticPath);

// const app = express();
const port = 5002;




connectDb().then(()=>{
    app.listen(port,()=>{
        console.log(`server is running on ${port}`);
    });
})
.catch((err)=>{
    console.log("Mongo db connection error ",err);
})

app.get("/",(req,res)=>{
    
});
