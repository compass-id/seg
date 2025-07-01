// import booked model
import Booked from "../models/BookedModel.js";
import asyncHandler from "express-async-handler";

// get all bookeds
export const getBookeds = asyncHandler(async (req, res) => {
  try {
    const bookeds = await Booked.find().sort({ name: 1, category: 1 });
    if (!bookeds) {
      res.status(404);
      throw new Error(`cannot find any booked`);
    }
    res.status(200).json(bookeds);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a booked by id
export const getBookedById = asyncHandler(async (req, res) => {
  try {
    const booked = await Booked.findById(req.params.id).sort({
      name: 1,
      category: 1,
    });
    if (!booked) {
      res.status(404);
      throw new Error(`cannot find any booked id`);
    }
    res.status(200).json(booked);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a booked by key
export const getBookedByKey = asyncHandler(async (req, res) => {
  try {
    const booked = await Booked.find({
      $or: [
        {
          name: {
            $regex: req.params.key,
          },
        },
        {
          category: {
            $regex: req.params.key,
          },
        },
        {
          isbn: {
            $regex: req.params.key,
          },
        },
      ],
    }).sort({ name: 1, category: 1 });
    if (!booked) {
      res.status(404);
      throw new Error(`cannot find any booked id`);
    }
    res.status(200).json(booked);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Add  booked
export const setBooked = asyncHandler(async (req, res) => {
  try {
    const booked = new Booked(req.body);
    const saved = await booked.save();
    if (!saved) {
      res.status(404);
      throw new Error(`cannot find any booked id`);
    }
    res.status(200).json(saved);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Edit booked
export const updBooked = asyncHandler(async (req, res) => {
  try {
    const booked = await Booked.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (!booked) {
      res.status(404);
      throw new Error(`cannot find any booked id`);
    }
    res.status(200).json(booked);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// delete a booked
export const delBooked = asyncHandler(async (req, res) => {
  try {
    const booked = await Booked.findByIdAndDelete({ _id: req.params.id });
    if (!booked) {
      res.status(404);
      throw new Error(`cannot find any booked id`);
    }
    res.status(200).json(booked);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
