const mongoose = require("mongoose");

const connectMongo = async (url) => {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected successfully");    
    }
    catch (err){
        console.error("Error connecting MongoDB: ", err);
    }
}

module.exports = {
    connectMongo
}