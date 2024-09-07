// routes/restaurants.js
import express from "express";
import Restaurant from "../models/products.js";
import { getProduct } from "../helpers/grpc/product.js";

const router = express.Router();

// GET route to fetch all restaurants
const getRestaurants = async (req, res) => {
  try {
    await getProduct("998545");
    const restaurants = await Restaurant.find().limit(10);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getRestaurants };
