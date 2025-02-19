
import express, { urlencoded } from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';

const app =express();

const __filname = fileURLToPath(import.meta.url);
const __dirname = path.join(__filname,"../public");
const staticPath = __dirname;

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true,
    methods:["get","put","delete","patch","update"]
}))

//middleweres
app.use(express.json({limit:"16kb"}));
app.use(express.static(staticPath));
app.use(urlencoded({extended:true}));
app.use(cookieParser());


//import routers
import userRouter from './routes/user.routes.js'

app.use("/api/v1/users",userRouter);














export default app;