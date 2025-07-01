// import dependencies
import PostEn from "../models/PostEnModel.js";
import asyncHandler from "express-async-handler";

// Add  PostEn
export const setPostEn = asyncHandler(async (req, res) => {
  try {
    const pst = new PostEn(req.body);
    const saved = await pst.save();
    if (!saved) {
      res.status(404);
      throw new Error(`cannot add any pst`);
    }
    res.status(200).json(saved);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get all pst
export const getPostEn = asyncHandler(async (req, res) => {
  try {
    const pst = await PostEn.find()
      .populate("fileList")
      .sort({ date: -1, title: 1 });
    if (!pst) {
      res.status(404);
      throw new Error(`cannot find any PostEn`);
    }
    res.status(200).json(pst);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a PostEn by id
export const getPostEnById = asyncHandler(async (req, res) => {
  try {
    const pst = await PostEn.findById(req.params.id)
      .populate("fileList")
      .sort({ date: -1, title: 1 });
    if (!pst) {
      res.status(404);
      throw new Error(`cannot find any PostEn id`);
    }
    res.status(200).json(pst);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a PostEn by key
export const getPostEnByKey = asyncHandler(async (req, res) => {
  try {
    const pst = await PostEn.find({
      $or: [
        {
          title: {
            $regex: req.params.key,
          },
        },
        {
          category: {
            $regex: req.params.key,
          },
        },
        {
          tags: {
            $regex: req.params.key,
          },
        },
        {
          body: {
            $regex: req.params.key,
          },
        },
        {
          fileList: {
            $elemMatch: {
              url: { $regex: req.params.key, $options: "i" }, // Case-insensitive search
            },
          },
        },
      ],
    })
      .populate("fileList")
      .sort({ date: -1, title: 1 });
    if (!pst) {
      res.status(404);
      throw new Error(`cannot find any PostEn id`);
    }
    res.status(200).json(pst);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Edit PostEn
export const updPostEn = asyncHandler(async (req, res) => {
  try {
    const pst = await PostEn.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true } // exclude file field
    );
    if (!pst) {
      res.status(404);
      throw new Error(`cannot find any PostEn id`);
    }
    res.status(200).json(pst);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// delete a PostEn
export const delPostEn = asyncHandler(async (req, res) => {
  try {
    const pst = await PostEn.findByIdAndDelete({ _id: req.params.id });
    if (!pst) {
      res.status(404);
      throw new Error(`cannot find any PostEn id`);
    }
    res.status(200).json(pst);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
