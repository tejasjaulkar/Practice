import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import connectDb from '../my-server/public/db.js'

const __filname = fileURLToPath(import.meta.url);

const __dirname = path.join(__filname,"../public");


const staticPath = __dirname;

console.log("filename",staticPath);

const app = express();
const port = 5002;

app.use(express.static(staticPath));


connectDb();

app.get("/",(req,res)=>{
    
});

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
});