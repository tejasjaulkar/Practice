import express, { urlencoded } from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import connectDb from '../my-server/public/db.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const __filname = fileURLToPath(import.meta.url);

const __dirname = path.join(__filname,"../public");


const staticPath = __dirname;

// console.log("filename",staticPath);

const app = express();
const port = 5002;


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true,
    methods:["get","put","delete","patch","update"]
}))

//middleweres

app.use(express.static(staticPath));
app.use(express.json({limit:"16kb"}));
app.use(urlencoded({extended:true}));
app.use(cookieParser());




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
