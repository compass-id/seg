// import dependencies
import Invoice from "../models/InvoiceModel.js";
import asyncHandler from "express-async-handler";

// Add  Invoice
export const setInvoice = asyncHandler(async (req, res) => {
  try {
    const inv = new Invoice(req.body);
    const saved = await inv.save();
    if (!saved) {
      res.status(404);
      throw new Error(`cannot add any inv`);
    }
    res.status(200).json(saved);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get all inv
export const getInvoices = asyncHandler(async (req, res) => {
  try {
    const inv = await Invoice.find()
      .populate("bookList")
      .sort({ date: -1, serie: -1 });
    if (!inv) {
      res.status(404);
      throw new Error(`cannot find any Invoice`);
    }
    res.status(200).json(inv);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a Invoice by id
export const getInvoiceById = asyncHandler(async (req, res) => {
  try {
    const inv = await Invoice.findById(req.params.id)
      .populate("bookList")
      .sort({ date: -1, serie: -1 });
    if (!inv) {
      res.status(404);
      throw new Error(`cannot find any Invoice id`);
    }
    res.status(200).json(inv);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a Invoice by key
export const getInvoiceByKey = asyncHandler(async (req, res) => {
  try {
    const inv = await Invoice.find({
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
              bookName: { $regex: req.params.key },
              isbn: { $regex: req.params.key }, // Case-insensitive search
            },
          },
        },
      ],
    }).sort({ date: -1, serie: -1 });
    if (!inv) {
      res.status(404);
      throw new Error(`cannot find any Invoice id`);
    }
    res.status(200).json(inv);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Edit Invoice
export const updInvoice = asyncHandler(async (req, res) => {
  try {
    const inv = await Invoice.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true } // exclude file field
    );
    if (!inv) {
      res.status(404);
      throw new Error(`cannot find any Invoice id`);
    }
    res.status(200).json(inv);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// delete a Invoice
export const delInvoice = asyncHandler(async (req, res) => {
  try {
    const inv = await Invoice.findByIdAndDelete({ _id: req.params.id });
    if (!inv) {
      res.status(404);
      throw new Error(`cannot find any Invoice id`);
    }
    res.status(200).json(inv);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
