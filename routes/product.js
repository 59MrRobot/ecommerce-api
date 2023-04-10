const router = require("express").Router();
const Product = require("../models/Product");
const { 
  verifyTokenAndAdmin
} = require("./verifyToken");

const sendResponse = (res, data) => res.status(200).json(data);
const sendError = (res, error) => res.status(500).json(error);

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();

    sendResponse(res, savedProduct);
  } catch(error) {
    sendError(res, error);
  }
})

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    
    sendResponse(res, updatedProduct);
  } catch(error) {
    sendError(res, error);
  }
})

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    sendResponse(res, "Product has been deleted...");
  } catch(error) {
    sendError(res, error);
  }
})

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;

  try {
    let products;

    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(8);
    } else if (queryCategory) {
      products = await Product.find({
        categories: {
          $in: [queryCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    sendResponse(res, products);
  } catch(error) {
    sendError(res, error);
  }
})

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    sendResponse(res, product);
  } catch(error) {
    sendError(res, error);
  }
})

module.exports = router;