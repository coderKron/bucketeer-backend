const { Schema, model } = require("mongoose");
const { default: mongoose } = require("mongoose");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      requied: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    kicks: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kicks",
    },
    content: [
      {
        type: String,
        requied: true,
      },
    ],
    pictures: [
      {
        type: String,
      },
    ],
    visibility: {
        enum: ["Private", "Public"],
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Blogs = model("Blogs", blockSchemata);

module.exports = Blogs