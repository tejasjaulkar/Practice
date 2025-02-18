import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
        // required: true,
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

userSchema.methods.generateAccesssTokens = async function()
{
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )  
}

userSchema.methods.generateRefreshTokens = async function()
{
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email  
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User",userSchema);

export default User;
