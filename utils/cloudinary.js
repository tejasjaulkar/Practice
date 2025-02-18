import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

  // Configuration
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET 
});


const UploadOnCloudinary = async(LocalFilePath)=>{

    try {

        if(!LocalFilePath)return null;
        //upload on caudinary
        const response = await cloudinary.uploader.upload(LocalFilePath,{
            resource_type : "auto"
        })
        //uploaded
        console.log("file has been uploaded " ,response.url);
        fs.unlinkSync(LocalFilePath);
        return response;
    } catch (error) {

        fs.unlinkSync(LocalFilePath);
        return null;
    }
}

export  {UploadOnCloudinary};