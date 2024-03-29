const { Schema, model } = require("mongoose");
const { default: mongoose } = require("mongoose");

const kicksSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    continent: {
      type: String,
      enum: [
        "Antarctica",
        "Australia",
        "Asia",
        "Africa",
        "Europe",
        "North-America",
        "Middle-East",
        "South-America",
      ],
      required: [true, "Continent is a required field."],
    },
    location: {
      lat: { type: String },
      lng: { type: String },
    },

    country: String,
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
        required: true,  
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
