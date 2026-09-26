const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
dotenv.config()

// Force Node.js to use Google & Cloudflare DNS to resolve MongoDB Atlas SRV records
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // Fallback if DNS server set fails
}

const URL = process.env.MONGO_URL
mongoose.set('strictQuery', true)
const connectToMongo = async () => {
    try {
        let db = await mongoose.connect(URL)
        console.log("MongoDB Connected:", db.connection.host);
    } catch (error) {
        console.log("MongoDB Connection Error:", error);
    }
}

module.exports = connectToMongo;