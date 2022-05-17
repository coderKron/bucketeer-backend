const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    password: String,
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
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
