
const cloudinary = require("cloudinary").v2;

import endPoint from "../config/endpoints.config"
const uploadPhoto = async (photo: Buffer) => {
  cloudinary.config({
    cloud_name: endPoint.cloudName,
    api_key: endPoint.cloudApiKey,
    api_secret: endPoint.cloudApiSecret,
    secure: true,
  });
  try {
    const image = await cloudinary.uploader.upload(photo);

    return image
  }
  catch (err) {
    return err
  }
};
export default uploadPhoto;
