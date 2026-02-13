// import dependencies
import express from "express";
import {
  setInvoice,
  getInvoices,
  getInvoiceById,
  getInvoiceByKey,
  updInvoice,
  delInvoice,
} from "../controllers/InvoiceController.js";

// router init
const invoiceRouter = express.Router();

// set the routes
invoiceRouter.get("/api/invoices", getInvoices);
invoiceRouter.get("/api/invoices/id/:id", getInvoiceById);
invoiceRouter.get("/api/invoices/key/:key", getInvoiceByKey);
invoiceRouter.post("/api/invoices", setInvoice);
invoiceRouter.patch("/api/invoices/id/:id", updInvoice);
invoiceRouter.delete("/api/invoices/id/:id", delInvoice);

export default invoiceRouter;
