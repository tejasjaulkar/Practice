import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/Apierror.js"
import User from "../models/user.models.js";
import {UploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/Apiresponse.js";


const registerUser = asyncHandler(async (req,res)=>
{
    console.log("req.files",req.files)
    console.log("Received Avatar:", req.files?.avatar?.[0]);


        const {username , email ,password} = req.body;

       if( [username , email ,password].some(field=>field?.trim()===""))
       {
            throw new ApiError(400,"Alll fields are required");
       }

    const existedUser =(await User.findOne
    (
        {
            $or:[{email},{username}]
        }
    ))

       if(existedUser)
       {
            throw new ApiError(400,"user Already Exists");
       }

       
        //url of avatar file which is nothing but the profile pic 

        const AvatarLocalPath  = req.files?.avatar[0]?.path;

        const avatar = await UploadOnCloudinary(AvatarLocalPath)

        if(!avatar)
        {
            throw new ApiError(500,"avatar is not uploaded on cloudinary");
        }

        const user =await  User.create(
            {
                email,
                username,
                password,
                avatar:avatar.url,
            }
        )

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        console.log(createdUser);

        if(!createdUser)
        {
            throw new ApiError(500,"something goes wrong while registering user");
        }  
        
       return res.status(201).json(

            new ApiResponse(200,existedUser,"user registered successfully")
        )

});

const loginUser = asyncHandler((req,res)=>
{
    res.status(200).json({
        message:"ok",
    })
})

export {registerUser,loginUser}