const { Schema, model } = require("mongoose");
const { default: mongoose } = require("mongoose");

const storySchema = new Schema(
  {
    title: {
      type: String,
      requied: true,
    },
    kick: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kick",
    },
    content: String,
    pictures: [
      {
        type: String,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Story = model("Story", storySchema);

module.exports = Story;
