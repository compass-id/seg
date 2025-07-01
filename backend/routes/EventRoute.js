// import dependencies
import express from "express";
import {
  setEvent,
  getEvent,
  getEventById,
  getEventByKey,
  updEvent,
  delEvent,
} from "../controllers/EventController.js";

// router init
const eventRouter = express.Router();

// set the routes
eventRouter.get("/api/events", getEvent);
eventRouter.get("/api/events/id/:id", getEventById);
eventRouter.get("/api/events/key/:key", getEventByKey);
eventRouter.post("/api/events", setEvent);
eventRouter.patch("/api/events/id/:id", updEvent);
eventRouter.delete("/api/events/id/:id", delEvent);

export default eventRouter;
