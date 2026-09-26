const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (req, res) => {
    try {
        if (req.file) {
            // Upload file buffer using Cloudinary stream upload
            const streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "ecommerce_products" },
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );
                    stream.end(req.file.buffer);
                });
            };

            const result = await streamUpload(req);
            return res.status(200).json({
                success: true,
                message: "Image uploaded successfully",
                url: result.secure_url,
                public_id: result.public_id
            });
        } else if (req.body.image) {
            // Direct base64/URL upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.body.image, {
                folder: "ecommerce_products"
            });
            return res.status(200).json({
                success: true,
                message: "Image uploaded successfully",
                url: result.secure_url,
                public_id: result.public_id
            });
        } else {
            return res.status(400).json({ success: false, message: "No file or image data provided" });
        }
    } catch (error) {
        console.log("Cloudinary Upload Error:", error);
        return res.status(500).json({
            success: false,
            message: "Cloudinary upload failed",
            error: error.message
        });
    }
};

module.exports = { uploadImage };
