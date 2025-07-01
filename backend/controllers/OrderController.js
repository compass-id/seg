// import dependencies
import Order from "../models/OrderModel.js";
import asyncHandler from "express-async-handler";

// Add  Order
export const setOrder = asyncHandler(async (req, res) => {
  try {
    const ord = new Order(req.body);
    const saved = await ord.save();
    if (!saved) {
      res.status(404);
      throw new Error(`cannot add any Order`);
    }
    res.status(200).json(saved);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get all ords
export const getOrders = asyncHandler(async (req, res) => {
  try {
    const ord = await Order.find()
      .populate("bookList")
      .sort({ date: -1, serie: -1 });
    if (!ord) {
      res.status(404);
      throw new Error(`cannot find any Order`);
    }
    res.status(200).json(ord);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a Order by id
export const getOrderById = asyncHandler(async (req, res) => {
  try {
    const ord = await Order.findById(req.params.id)
      .populate("bookList")
      .sort({ date: -1, serie: -1 });
    if (!ord) {
      res.status(404);
      throw new Error(`cannot find any Order id`);
    }
    res.status(200).json(ord);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a Order by key
export const getOrderByKey = asyncHandler(async (req, res) => {
  try {
    const ord = await Order.find({
      $or: [
        {
          date: {
            $regex: req.params.key,
          },
        },
        {
          sales: {
            $regex: req.params.key,
          },
        },
        {
          serie: {
            $regex: req.params.key,
          },
        },
        {
          name: {
            $regex: req.params.key,
          },
        },
        {
          company: {
            $regex: req.params.key,
          },
        },
        {
          email: {
            $regex: req.params.key,
          },
        },
        {
          phone: {
            $regex: req.params.key,
          },
        },
        {
          address: {
            $regex: req.params.key,
          },
        },
        {
          bookList: {
            $elemMatch: {
              bookName: { $regex: req.params.key, $options: "i" },
              isbn: { $regex: req.params.key, $options: "i" }, // Case-insensitive search
            },
          },
        },
      ],
    }).sort({ date: -1, serie: -1 });
    if (!ord) {
      res.status(404);
      throw new Error(`cannot find any Order id`);
    }
    res.status(200).json(ord);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Edit Order
export const updOrder = asyncHandler(async (req, res) => {
  try {
    const ord = await Order.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true } // exclude file field
    );
    if (!ord) {
      res.status(404);
      throw new Error(`cannot find any Order id`);
    }
    res.status(200).json(ord);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// delete a Order
export const delOrder = asyncHandler(async (req, res) => {
  try {
    const ord = await Order.findByIdAndDelete({ _id: req.params.id });
    if (!ord) {
      res.status(404);
      throw new Error(`cannot find any Order id`);
    }
    res.status(200).json(ord);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
