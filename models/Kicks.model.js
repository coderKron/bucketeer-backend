const { Schema, model } = require("mongoose");
const {default: mongoose} = require('mongoose')


const kicksSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {type: {type:String}, coordinates: [Number]},
    category: {
      type: String,
      enum: ["Travel", "Chill", "Activity"],
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    doneBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Kicks = model("Kicks", kicksSchema);

module.exports = Kicks;
