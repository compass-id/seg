// import dependencies
import PostId from "../models/PostIdModel.js";
import asyncHandler from "express-async-handler";

// Add  PostId
export const setPostId = asyncHandler(async (req, res) => {
  try {
    const pst = new PostId(req.body);
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
export const getPostId = asyncHandler(async (req, res) => {
  try {
    const pst = await PostId.find()
      .populate("fileList")
      .sort({ date: -1, title: 1 });
    if (!pst) {
      res.status(404);
      throw new Error(`cannot find any PostId`);
    }
    res.status(200).json(pst);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a PostId by id
export const getPostIdById = asyncHandler(async (req, res) => {
  try {
    const pst = await PostId.findById(req.params.id)
      .populate("fileList")
      .sort({ date: -1, title: 1 });
    if (!pst) {
      res.status(404);
      throw new Error(`cannot find any PostId id`);
    }
    res.status(200).json(pst);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a PostId by key
export const getPostIdByKey = asyncHandler(async (req, res) => {
  try {
    const pst = await PostId.find({
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
      throw new Error(`cannot find any PostId id`);
    }
    res.status(200).json(pst);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Edit PostId
export const updPostId = asyncHandler(async (req, res) => {
  try {
    const pst = await PostId.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true } // exclude file field
    );
    if (!pst) {
      res.status(404);
      throw new Error(`cannot find any PostId id`);
    }
    res.status(200).json(pst);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// delete a PostId
export const delPostId = asyncHandler(async (req, res) => {
  try {
    const pst = await PostId.findByIdAndDelete({ _id: req.params.id });
    if (!pst) {
      res.status(404);
      throw new Error(`cannot find any PostId id`);
    }
    res.status(200).json(pst);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
