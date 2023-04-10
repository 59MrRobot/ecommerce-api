const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Cart = require("../models/Cart");

dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(401).json("Token has expired");
        } else {
          return res.status(403).json("Token is not valid");
        }
      }

      req.user = user;

      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
}

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
}

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
}

const verifyCartOwner = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.body.userId || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
}

const verifyCartOwnerForDelete = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json("Cart not found!");
    }

    if (cart.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json("You are not allowed to do that!");
    }

    req.cart = cart;

    next();
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyCartOwner,
  verifyCartOwnerForDelete,
};