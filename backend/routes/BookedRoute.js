// import Booked controller
import {
  getBookeds,
  getBookedById,
  getBookedByKey,
  updBooked,
  delBooked,
  setBooked,
} from "../controllers/BookedController.js";

// import express
import express from "express";

// make a router
const bookedRouter = express.Router();

// set the routes
bookedRouter.get("/api/booked", getBookeds);
bookedRouter.get("/api/booked/id/:id", getBookedById);
bookedRouter.get("/api/booked/key/:key", getBookedByKey);
bookedRouter.post("/api/booked", setBooked);
bookedRouter.patch("/api/booked/id/:id", updBooked);
bookedRouter.delete("/api/booked/id/:id", delBooked);

// export the router
export default bookedRouter;
