// import dependencies
import express from "express";
import {
  setPostId,
  getPostId,
  getPostIdById,
  getPostIdByKey,
  updPostId,
  delPostId,
} from "../controllers/PostIdController.js";

// router init
const postIdRouter = express.Router();

// set the routes
postIdRouter.get("/api/posts/id/", getPostId);
postIdRouter.get("/api/posts/id/id/:id", getPostIdById);
postIdRouter.get("/api/posts/id/key/:key", getPostIdByKey);
postIdRouter.post("/api/posts/id/", setPostId);
postIdRouter.patch("/api/posts/id/id/:id", updPostId);
postIdRouter.delete("/api/posts/id/id/:id", delPostId);

export default postIdRouter;
