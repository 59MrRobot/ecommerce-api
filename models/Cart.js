const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        size: {
          type: String,
        },
        color: {
          type: String,
        },
        total: {
          type: Number,
        },
      }
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Cart", CartSchema);