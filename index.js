// Importing required modules
const express = require("express"); // Express framework for building server
const { connectMongo } = require("./connections"); // MongoDB connection function
const cors = require("cors"); // Middleware for Cross Origin Resource Sharing
const routes = require("./routers"); // Importing routers
require("dotenv").config(); // Load environment variable from .env


// Initializing Express app
const app = express();

// Setting up server port from environment variables or default to 8080
const PORT = process.env.PORT || 8080;

// MongoDB connection URI from environment variables
const MongoURI = process.env.MONGO_URI;


// Connecting to MongoDB
connectMongo(MongoURI);


// Middleware to allow cross origin requests
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());


// Using imported routes for handling requests
app.use(routes);


// Starting the server and listening on specified port
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});