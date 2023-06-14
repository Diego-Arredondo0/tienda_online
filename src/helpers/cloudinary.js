const cloudinary = require("cloudinary")

const imagenes = {}

cloudinary.config({
    cloud_name: "dmxhsnbx6",
    api_key: "915331846591827",
    api_secret: "wmNZ89j46W8umzV2EDBviQASCpc",
});

imagenes.uploadImage = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: "posts",
    });
};

imagenes.deleteImage = async (id) => {
    return await cloudinary.uploader.destroy(id);
};

module.exports = imagenes