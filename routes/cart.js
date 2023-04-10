const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyCartOwner,
  verifyCartOwnerForDelete,
} = require("./verifyToken");

//CREATE
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();

    res.status(200).json(savedCart);
  } catch(error) {
    res.status(500).json(error);
  }
})

//UPDATE
router.put("/:id", verifyCartOwner, async (req, res) => {

  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    
    res.status(200).json(updatedCart);
  } catch(error) {
    res.status(500).json(error);
  }
})

//DELETE
router.delete("/:id", verifyToken, verifyCartOwnerForDelete, async (req, res) => {
  try {
    await req.cart.remove();

    res.status(200).json({ message: "Your cart has been deleted..." });
  } catch(error) {
    res.status(500).json(error);
  }
})

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();

    res.status(200).json(carts);
  } catch(error) {
    res.status(500).json(error);
  }
})

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId });

    res.status(200).json(cart);
  } catch(error) {
    res.status(500).json(error);
  }
})

module.exports = router;