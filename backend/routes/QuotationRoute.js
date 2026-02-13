// import dependencies
import express from "express";
import {
  setQuotation,
  getQuotations,
  getQuotationById,
  getQuotationByKey,
  updQuotation,
  delQuotation,
} from "../controllers/QuotationController.js";

// router init
const quotationRouter = express.Router();

// set the routes
quotationRouter.get("/api/quotations", getQuotations);
quotationRouter.get("/api/quotations/id/:id", getQuotationById);
quotationRouter.get("/api/quotations/key/:key", getQuotationByKey);
quotationRouter.post("/api/quotations", setQuotation);
quotationRouter.patch("/api/quotations/id/:id", updQuotation);
quotationRouter.delete("/api/quotations/id/:id", delQuotation);

export default quotationRouter;
