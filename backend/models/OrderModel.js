// import dependencies
import mongoose from "mongoose";

// create a schema
const ordSchema = mongoose.Schema(
  {
    serie: {
      type: String,
    },
    date: {
      type: String,
    },
    name: {
      type: String,
    },
    company: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    sales: {
      type: String,
    },
    bookList: [
      {
        bookName: {
          type: String,
        },
        isbn: {
          type: String,
        },
        price: {
          type: String,
        },
        qty: {
          type: String,
        },
        disc: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// export the schema
export default mongoose.model("order", ordSchema);
