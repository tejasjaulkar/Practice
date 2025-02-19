import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/Apierror.js"
import User from "../models/user.models.js";
import {UploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/Apiresponse.js";
import jwt from 'jsonwebtoken'
// import { verifyJwt } from "../middlewares/verifyJWT.miidleware.js";


const options = 
{
    httpOnly : true,
    secure:true
}
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async function generateAccesssAndRefreshTokens(userId) {

    try {

        const user = await User.findById(userId);
        const accessToken = await user.generateAccesssTokens();
        const refreshToken = await user.generateRefreshTokens()
         //refresh token need to be store in the database
         //so we need object that is our user so store in it
         user.refreshToken = refreshToken;
         await user.save({validateBeforeSave:false});
            //from database   //its function RefreshToken
        return {accessToken,refreshToken};

    } catch (error) {

        throw new ApiError(500,"error in Generating Tokens")
    }
  }

const registerUser = asyncHandler(async (req,res)=>
{

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

        if(!isValidEmail(email))
        {
            throw new ApiError(402," email formatting error ");
        }

    
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

            new ApiResponse(200,createdUser,"user registered successfully")
        )
        });

const loginUser = asyncHandler(async(req,res)=>
        {
            //req.body
            //check username and email exists in db
            //if then check password is correct or not 
            //geneate access and refresh token 
            //return 

            const {username,email,password} = req.body;
            console.log(req.body);
            
            const user = await User.findOne({
                $or:[{username},{email}]
            })
            
            if(!user)
            {
                throw new ApiError(400,"user not found");
            }

            const isValidPassword =await  user.isCorrectPassword(password)
            
            if(!isValidPassword)
            {
                throw new ApiError(401,"password is not correct")
            }

            // const accessTokens = await user.generateAccesssTokens();
            // const refreshTokens = await user.generateRefreshTokens();

            //i can do like this but i will try to make one function which directly gives me 
            //access and refresh tokens so that i will get both of them at a time
            // i am using generateAcessAndRefreshTokens fn

            const {accessToken,refreshToken} = await generateAccesssAndRefreshTokens(user._id);

            // const loggedInUser = await User.findById(user._id).select("-password -RefreshToken")
            const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

            const options=
            {
                httpOnly : true,
                secure : true
            }

            return res
            .status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)
            .json
            (
                new ApiResponse
                (
                    200,
                    {
                        user:loggedInUser,refreshToken,accessToken
                    },
                    {
                        message:"user logged In"
                    }
                )
            )
        })

const logoutUser = asyncHandler(async (req,res) => {
            
            const user = await User.findByIdAndUpdate(

                req.user._id,
                {
                    $set: 
                    {
                        refreshToken: undefined
                    }
                },
                {
                    new:true
                }
            )

            const options = 
            {
                httpOnly : true,
                secure : true
            }

           return res
           .status(202)
           .clearCookie("accessToken",options)
           .clearCookie("refreshToken",options)
           .json(

              new ApiResponse
              (
                202,
                {
                    message: " user successfully logged out"
                }
            )
           )
        })

const refreshAccessToken = asyncHandler(async (req,res) => {

    //i want to refresh access token of user using refreshtoken
    //steps
    //take ref token from http or from body
    //check , decode it , check decoded token
    // get user by decoded._id
    //match it with user.refreshtoken and currentrefresh_token

    try {
        currentRefreshToken = req.cookie?.refreshToken || req.body.refreshToken
    
        if(!currentRefreshToken)
        {
            throw new ApiError(401,"Unauthorized req")
        }
    
        decodedRefreshToken = jwt.verify(currentRefreshToken,REFRESH_TOKEN_SECRET)
    
        if(!decodedRefreshToken)
        {
            throw new ApiError(401,"Unauthorized req")
        }
    
        const user = await User.findById(decodedRefreshToken._id)
    
        if(user.refreshToken !== decodedRefreshToken)
        {
            throw new ApiError(401,"Unauthorized req")        
        }
    
        const { accessToken , refreshToken} = generateAccesssAndRefreshTokens(user._id)
    
        res.status(203)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json
        (
            new ApiResponse(
                203,
                {
                    accessToken,refreshToken
                },
                {
                    message : "user logged in using refrehToken"
                }
            )
        )
    
    } catch (error) {

        throw new ApiError(405,"unauthorized request")
        
    }
})

export {registerUser,loginUser,logoutUser,refreshAccessToken}