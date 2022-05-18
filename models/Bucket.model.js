const { Schema, model } = require("mongoose");


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
    pictures: [
      {
        type: String,
        default:
          "https://res.cloudinary.com/coderkron/image/upload/v1651678876/pt-app/avatar-g2d383e400_1280_hojdie.png",
      },
    ],
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
          type: string,
        },
        comment: {
          type: string,
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
