const express = require("express");
const { connectMongo } = require("./connections");
const { userSignup, userLogin } = require("./controllers/user");
const { doctorSignup, doctorLogin } = require("./controllers/doctor");

require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 8080;
const MongoURI = process.env.MONGO_URI;

connectMongo(MongoURI);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the SERVER!");
});

app.post("/api/auth/user/signup", userSignup);
app.post("/api/auth/user/login", userLogin);
app.post("/api/auth/doctor/signup", doctorSignup);
app.post("/api/auth/doctor/login", doctorLogin);

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})