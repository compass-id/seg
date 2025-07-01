// import dependencies
import Party from "../models/PartyModel.js";
import asyncHandler from "express-async-handler";

// Add  Party
export const setParty = asyncHandler(async (req, res) => {
  try {
    const prt = new Party(req.body);
    const saved = await prt.save();
    if (!saved) {
      res.status(404);
      throw new Error(`cannot add any Party`);
    }
    res.status(200).json(saved);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get all prts
export const getParty = asyncHandler(async (req, res) => {
  try {
    const prt = await Party.find().sort({
      createdAt: -1,
    });
    if (!prt) {
      res.status(404);
      throw new Error(`cannot find any Party`);
    }
    res.status(200).json(prt);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a Party by id
export const getPartyById = asyncHandler(async (req, res) => {
  try {
    const prt = await Party.findById(req.params.id).sort({
      createdAt: -1,
    });
    if (!prt) {
      res.status(404);
      throw new Error(`cannot find any Party id`);
    }
    res.status(200).json(prt);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a Party by key
export const getPartyByEvent = asyncHandler(async (req, res) => {
  try {
    const prt = await Party.find({
      $or: [
        {
          event: {
            $regex: req.params.event,
          },
        },
      ],
    }).sort({ createdAt: -1 });
    if (!prt) {
      res.status(404);
      throw new Error(`cannot find any Party id`);
    }
    res.status(200).json(prt);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a Party by key
export const getPartyByKey = asyncHandler(async (req, res) => {
  try {
    const prt = await Party.find({
      $or: [
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
          method: {
            $regex: req.params.key,
          },
        },
      ],
    }).sort({ createdAt: -1 });
    if (!prt) {
      res.status(404);
      throw new Error(`cannot find any Party id`);
    }
    res.status(200).json(prt);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Edit Party
export const updParty = asyncHandler(async (req, res) => {
  try {
    const prt = await Party.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true } // exclude file field
    );
    if (!prt) {
      res.status(404);
      throw new Error(`cannot find any Party id`);
    }
    res.status(200).json(prt);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// delete a Party
export const delParty = asyncHandler(async (req, res) => {
  try {
    const prt = await Party.findByIdAndDelete({ _id: req.params.id });
    if (!prt) {
      res.status(404);
      throw new Error(`cannot find any Party id`);
    }
    res.status(200).json(prt);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
