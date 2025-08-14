const mongoose = require("mongoose");

const connectMongo = async (url) => {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected successfully");    
    }
    catch (err){
        console.error("Error connecting MongoDB: ", err);
        process.exit(1);
    }
}

module.exports = {
    connectMongo
}