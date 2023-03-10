const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("./verifyToken");

const sendResponse = (res, data) => res.status(200).json(data);
const sendError = (res, error) => res.status(500).json(error);

//CREATE
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();

    sendResponse(res, savedCart);
  } catch(error) {
    sendError(res, error);
  }
})

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    
    sendResponse(res, updatedCart);
  } catch(error) {
    sendError(res, error);
  }
})

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    sendResponse(res, "Cart has been deleted...");
  } catch(error) {
    sendError(res, error);
  }
})

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();

    sendResponse(res, carts);
  } catch(error) {
    sendError(res, error);
  }
})

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId });

    sendResponse(res, cart);
  } catch(error) {
    sendError(res, error);
  }
})

module.exports = router;