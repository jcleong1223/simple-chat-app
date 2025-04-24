import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

/****** Need to have this use the data in .env file ******/
config();


cloudinary.config({
    /****** Put this object with 3 different fields ******/
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export default cloudinary; 