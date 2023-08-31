import cloudinary from 'cloudinary';

interface ICloudinary {
    cloud_name: string;
    api_key: string;
    api_secret: string;
}

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_Key,
    api_secret: process.env.CLOUD_API_SECRET
} as ICloudinary);


//upload file
export const uploadFileToCloud = async (file: any) => {
    try {
        const res = await cloudinary.v2.uploader.upload(file, {
            folder: 'thumbnail'
        });
        return res;
    } catch (error) {
        console.log(error);
    }
}

//upload video file
export const uploadVideoToCloud = async (file: any) => {
    try {
        const res = await cloudinary.v2.uploader.upload(file, {
            resource_type: "video",
            folder: 'video'
        });
        return res;
    } catch (error) {
        console.log(error);
    }
}


//delete file
export const deleteFileFromCloud = async (file: any) => {
    try {
        const res = await cloudinary.v2.uploader.destroy(file);
        return res;
    } catch (error) {
        console.log(error);
    }
}






export default cloudinary;