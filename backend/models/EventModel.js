// import dependencies
import mongoose from "mongoose";

// create a schema
const evtSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    price: {
      type: String,
    },
    model: {
      type: String,
    },
    address: {
      type: String,
    },
    desc: {
      type: String,
    },
    pic: {
      type: String,
    },
    img: {
      type: String,
    },
    start: {
      type: String,
    },
    end: {
      type: String,
    },
    contact: {
      type: String,
    },
    group: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// export the schema
export default mongoose.model("Event", evtSchema);
