// import book model
import Book from "../models/BookModel.js";
import asyncHandler from "express-async-handler";

// get all books
export const getBooks = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find().sort({ name: 1, createdAt: 1 });
    if (!books) {
      res.status(404);
      throw new Error(`cannot find any book`);
    }
    res.status(200).json(books);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a book by id
export const getBookById = asyncHandler(async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).sort({
      name: 1,
      createdAt: 1,
    });
    if (!book) {
      res.status(404);
      throw new Error(`cannot find any book id`);
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// book isbn
// get a book's ISBN by name (exact match)
export const getIsbnByName = asyncHandler(async (req, res) => {
  try {
    const book = await Book.findOne({ name: req.params.name });
    if (!book) {
      res.status(404);
      throw new Error(`Cannot find book with name: ${req.params.name}`);
    }
    res.status(200).json(book.isbn);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Get book name by ISBN
export const getNameByIsbn = asyncHandler(async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) {
      res.status(404);
      throw new Error(`Cannot find book with ISBN: ${req.params.isbn}`);
    }
    res.status(200).json(book.name);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Get book name by ISBN
export const getPriceByIsbn = asyncHandler(async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) {
      res.status(404);
      throw new Error(`Cannot find book with ISBN: ${req.params.isbn}`);
    }

    // Recommended Change:
    res.status(200).send(String(book.bookPrice)); // Sends the price as a plain string, e.g., "140000"
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Get book name by ISBN
export const getEPriceByIsbn = asyncHandler(async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) {
      res.status(404);
      throw new Error(`Cannot find book with ISBN: ${req.params.isbn}`);
    }

    // Recommended Change:
    res.status(200).send(String(book.ebookPrice)); // Or { unitPrice: book.ebookPrice }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a book by key
export const getBookByKey = asyncHandler(async (req, res) => {
  try {
    const book = await Book.find({
      $or: [
        {
          name: {
            $regex: req.params.key,
          },
        },
        {
          category: {
            $regex: req.params.key,
          },
        },
        {
          isbn: {
            $regex: req.params.key,
          },
        },
      ],
    }).sort({ name: 1, createdAt: 1 });
    if (!book) {
      res.status(404);
      throw new Error(`cannot find any book id`);
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Add  book
export const setBook = asyncHandler(async (req, res) => {
  try {
    const book = new Book(req.body);
    const saved = await book.save();
    if (!saved) {
      res.status(404);
      throw new Error(`cannot find any book id`);
    }
    res.status(200).json(saved);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Edit book
export const updBook = asyncHandler(async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (!book) {
      res.status(404);
      throw new Error(`cannot find any book id`);
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// delete a book
export const delBook = asyncHandler(async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete({ _id: req.params.id });
    if (!book) {
      res.status(404);
      throw new Error(`cannot find any book id`);
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
