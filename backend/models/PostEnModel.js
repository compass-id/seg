// import dependencies
import mongoose from "mongoose";

// create a schema
const pstEnSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    category: {
      type: String,
    },
    tags: {
      type: String,
    },
    lang: {
      type: String,
    },
    date: {
      type: String,
    },
    banner: {
      type: String,
    },
    body: {
      type: String,
    },
    fileList: [
      {
        url: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// export the schema
export default mongoose.model("PostEn", pstEnSchema);
