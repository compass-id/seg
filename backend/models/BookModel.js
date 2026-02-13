// import dependencies
import mongoose from "mongoose";

// create a schema
const bookSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    isbn: {
      type: String,
    },
    category: {
      type: String,
    },
    bookPrice: {
      type: String,
    },
    ebookPrice: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// export the schema
export default mongoose.model("Book", bookSchema);
