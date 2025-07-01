// import dependencies
import express from "express";
import {
  setPostEn,
  getPostEn,
  getPostEnById,
  getPostEnByKey,
  updPostEn,
  delPostEn,
} from "../controllers/PostEnController.js";

// router init
const postEnRouter = express.Router();

// set the routes
postEnRouter.get("/api/posts/en/", getPostEn);
postEnRouter.get("/api/posts/en/id/:id", getPostEnById);
postEnRouter.get("/api/posts/en/key/:key", getPostEnByKey);
postEnRouter.post("/api/posts/en/", setPostEn);
postEnRouter.patch("/api/posts/en/id/:id", updPostEn);
postEnRouter.delete("/api/posts/en/id/:id", delPostEn);

export default postEnRouter;
