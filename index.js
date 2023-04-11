const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const cors = require("cors");
const crypto = require('crypto');
const nonce = crypto.randomBytes(16).toString('base64');
const port = process.env.PORT || 5000;

app.use(cors());

mongoose.set('strictQuery', false);
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`DB Connection Successful: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

app.get("/", (req, res) => {
  res.send("Welcome to the eCommerce Rest API");
});

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self' http://localhost:5000");
  next();
});

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", `script-src 'self' 'nonce-${nonce}'`);
  next();
});

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Backend server is running.");
  })
});