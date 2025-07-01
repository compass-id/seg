// import dependencies
import Quotation from "../models/QuotationModel.js";
import asyncHandler from "express-async-handler";

// Add  Quotation
export const setQuotation = asyncHandler(async (req, res) => {
  try {
    const qt = new Quotation(req.body);
    const saved = await qt.save();
    if (!saved) {
      res.status(404);
      throw new Error(`cannot add any Quotation`);
    }
    res.status(200).json(saved);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get all qt
export const getQuotations = asyncHandler(async (req, res) => {
  try {
    const qt = await Quotation.find()
      .populate("bookList")
      .sort({ date: -1, serie: -1 });
    if (!qt) {
      res.status(404);
      throw new Error(`cannot find any Quotation`);
    }
    res.status(200).json(qt);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a Quotation by id
export const getQuotationById = asyncHandler(async (req, res) => {
  try {
    const qt = await Quotation.findById(req.params.id)
      .populate("bookList")
      .sort({ date: -1, serie: -1 });
    if (!qt) {
      res.status(404);
      throw new Error(`cannot find any Quotation id`);
    }
    res.status(200).json(qt);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a Quotation by key
export const getQuotationByKey = asyncHandler(async (req, res) => {
  try {
    const qt = await Quotation.find({
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
    if (!qt) {
      res.status(404);
      throw new Error(`cannot find any Quotation id`);
    }
    res.status(200).json(qt);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Edit Quotation
export const updQuotation = asyncHandler(async (req, res) => {
  try {
    const qt = await Quotation.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true } // exclude file field
    );
    if (!qt) {
      res.status(404);
      throw new Error(`cannot find any Quotation id`);
    }
    res.status(200).json(qt);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// delete a Quotation
export const delQuotation = asyncHandler(async (req, res) => {
  try {
    const qt = await Quotation.findByIdAndDelete({ _id: req.params.id });
    if (!qt) {
      res.status(404);
      throw new Error(`cannot find any Quotation id`);
    }
    res.status(200).json(qt);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
