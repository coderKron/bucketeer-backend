const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/coderkron/image/upload/v1651678876/pt-app/avatar-g2d383e400_1280_hojdie.png",
    },

    way: {
      type: String,
      enum: ["To Enlighten", "To Achieve", "To Enjoy"],
    },
    tagline: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
