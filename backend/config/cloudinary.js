// config/cloudinary.js
const cloudinary = require("cloudinary").v2;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "dv3j4strx", // Thay thế bằng tên Cloudinary của bạn
    api_key: process.env.CLOUD_API_KEY || "174574997473513", // Thay thế bằng API Key của bạn
    api_secret: process.env.CLOUD_API_SECRET || "R3a0-Lla2qMjIhe9Gki98gkwvWA", // Thay thế bằng API Secret của bạn
});

module.exports = cloudinary;
