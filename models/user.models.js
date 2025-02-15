import mongoose from "mongoose";
import bcrypt from 'bcrypt'

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
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    refreshToken:
    {
        type:String
    },
},
{
    timestamps:true
})

userSchema.pre("save",async function (next) // middleware 
 {
    if(!this.isModified("password")) return next();

    const saltRounds = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,saltRounds);
    return next();
})

userSchema.methods.isCorrectPassword = async function (password) {

    return await bcrypt.compare(password,this.password);
}


const User = mongoose.model("User",userSchema);

export default User;
