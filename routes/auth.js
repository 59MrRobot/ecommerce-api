const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

function sendResponse(res, data) {
  if (!res.headersSent) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(data);
  }
}

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    fullName: req.body.fullName,
    password: CryptoJS.AES.encrypt(
      req.body.password, 
      process.env.PASS_SECRET
    ).toString(),
    isAdmin: req.body.isAdmin,
    image: req.body.image,
    status: req.body.status,
    country: req.body.country,
    number: req.body.number,
  });

  try {
    const savedUser = await newUser.save();

    sendResponse(res, savedUser);
    // res.status(201).json(savedUser);
  } catch(error) {
    res.status(500).json(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try{
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    res.status(401).json("Wrong credentials");
  }

  const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET);

  const decryptedPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

  if (decryptedPassword !== req.body.password) {
    res.status(401).json("Wrong credentials");
  }

  const accessToken = jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    }, 
    process.env.JWT_SECRET_KEY,
    { expiresIn: "3d"}
  );

  const { password, ...others } = user._doc;

  sendResponse(res, { ...others, accessToken });
  // res.status(200).json({ ...others, accessToken });
  } catch(error) {
    res.status(500).json(error);
  }
})

module.exports = router;