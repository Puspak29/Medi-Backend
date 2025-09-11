// Importing required modules
const mongoose = require("mongoose"); // Mongoose for MongoDB connection

/**
 * Asynchronously connects to MongoDB using provided connection URL.
 * @param {string} url - MongoDB connection string (URI).
 */
const connectMongo = async (url) => {
    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(url);
        console.log("MongoDB connected successfully");    
    }
    catch (err){
        // Log any connection errors
        console.error("Error connecting MongoDB: ", err);
        process.exit(1); // Exit process with failure
    }
}

// Exporting the connectMongo function for use in other files
module.exports = {
    connectMongo
}