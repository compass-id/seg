// import dependencies
import express from "express";
import {
  setParty,
  getParty,
  getPartyById,
  getPartyByKey,
  getPartyByEvent,
  updParty,
  delParty,
} from "../controllers/PartyController.js";

// router init
const partyRouter = express.Router();

// set the routes
partyRouter.get("/api/parties", getParty);
partyRouter.get("/api/parties/id/:id", getPartyById);
partyRouter.get("/api/parties/event/:event", getPartyByEvent);
partyRouter.get("/api/parties/key/:key", getPartyByKey);
partyRouter.post("/api/parties", setParty);
partyRouter.patch("/api/parties/id/:id", updParty);
partyRouter.delete("/api/parties/id/:id", delParty);

export default partyRouter;
