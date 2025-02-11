import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const connectDb  =async ()=>
{
    try
    {
        console.log("URL---------->",process.env.URI);
        await mongoose.connect(`${process.env.URI}`);
        console.log("successfully connect to mongoDB");

    }catch(err)
    {
        console.log("error in connecting mongoDB",err);
    }
}

export default connectDb;