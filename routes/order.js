const router = require("express").Router();
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("./verifyToken");

const sendResponse = (res, data) => res.status(200).json(data);
const sendError = (res, error) => res.status(500).json(error);

//CREATE
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();

    sendResponse(res, savedOrder);
  } catch(error) {
    sendError(res, error);
  }
})

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    
    sendResponse(res, updatedOrder);
  } catch(error) {
    sendError(res, error);
  }
})

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    sendResponse(res, "Order has been cancelled...");
  } catch(error) {
    sendError(res, error);
  }
})

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();

    sendResponse(res, orders);
  } catch(error) {
    sendError(res, error);
  }
})

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.findOne({ userId: req.params.userId });

    sendResponse(res, orders);
  } catch(error) {
    sendError(res, error);
  }
})

//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount"
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    sendResponse(res, income);
  } catch (error) {
    sendError(res, error);
  }
})

module.exports = router;