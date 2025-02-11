import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username :{
        type:String,
        required:true,
    },
    email:{

        type:String,
        required:true,
    },
    password:
    {
        type:String,
        required:true,
        min:[6,"minmum 6 length of passwoed requires !"]
    },

},
{
    timestamps:true
})

const User = mongoose.model("User",userSchema);

export default User;
