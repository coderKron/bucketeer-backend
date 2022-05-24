const { Schema, model } = require("mongoose");
const {default: mongoose} = require('mongoose')


const bucketSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },  
    kicks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kicks",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: String,
        },
        comment: {
          type: String,
        },
      },
    ],
  }, 

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Bucket = model("Bucket", bucketSchema);

module.exports = Bucket;
