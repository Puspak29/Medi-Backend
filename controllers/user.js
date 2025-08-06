const User = require("../models/user");
const { createHmac, randomBytes } = require("crypto");

async function userSignup(req, res) {
    const { name, email, password } = req.body;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex');
    await User.create({
        name,
        email,
        salt: salt,
        password: hashedPassword,
    });  

    return res.json({ success:true, message:"user created successfully" });
}

async  function userLogin(req, res){
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.json({error: "User not found"});
    const salt = user.salt;
    const hashedpassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest("hex")

    if (hashedpassword !== userProvidedHash) return res.json({ success: false, message:"Password is incorrect"});
    return res.json({success: true, message: "User login successfully", user: user});
}

module.exports = { userSignup, userLogin };