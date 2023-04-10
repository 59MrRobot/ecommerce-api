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
const { MongoClient } = require('mongodb');

app.use(cors());

mongoose.set('strictQuery', false);
dotenv.config();

// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("DB Connection Successful"))
//   .catch((error) => console.log(error));

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

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running.");
  })
});