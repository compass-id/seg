// import book controller
import {
  getBooks,
  getBookById,
  getBookByKey,
  updBook,
  delBook,
  setBook,
} from "../controllers/BookController.js";

// import express
import express from "express";

// make a router
const bookRouter = express.Router();

// set the routes
bookRouter.get("/api/books", getBooks);
bookRouter.get("/api/books/id/:id", getBookById);
bookRouter.get("/api/books/key/:key", getBookByKey);
bookRouter.post("/api/books", setBook);
bookRouter.patch("/api/books/id/:id", updBook);
bookRouter.delete("/api/books/id/:id", delBook);

// export the router
export default bookRouter;
