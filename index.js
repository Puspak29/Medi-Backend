const express = require("express");
const { connectMongo } = require("./connections");
const cors = require("cors");

const routes = require("./routers");

require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 8080;
const MongoURI = process.env.MONGO_URI;

connectMongo(MongoURI);

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});