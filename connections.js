const mongoose = require("mongoose");

/**
 * Asynchronously connects to MongoDB using provided connection URL.
 * @param {string} url - MongoDB connection string (URI).
 */
const connectMongo = async (url) => {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected");    
    }
    catch (err){
        console.error("Error connecting MongoDB: ", err);
        process.exit(1); // Exit process with failure
    }
}

module.exports = {
    connectMongo
}