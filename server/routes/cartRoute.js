import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  updateCart,
  addToCart,
  removeFromCart,
} from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/update", authUser, updateCart);
cartRouter.post("/add", authUser, addToCart);
cartRouter.post("/remove", authUser, removeFromCart);

export default cartRouter;
