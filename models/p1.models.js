import mongoose from "mongoose";

const p1Schema = new mongoose.Schema({

    username:{

        type: String,
        required : true,

    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        min: [6,"mini 6 chars req"]
    }

},{timestamps:true})

const userp1 = mongoose.model("userp1",p1Schema);

export default userp1;
