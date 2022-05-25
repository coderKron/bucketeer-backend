const { Schema, model } = require("mongoose");
const { default: mongoose } = require("mongoose");


const journalSchema = new Schema(
  {
    title: {
      type: String,
      requied: true,
    },
    description: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    bucket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bucket",
    },
    story: [
      { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story",
      },
    ],
     visibility: {
       type: String,
        enum: ["Private", "Public"],
    }
  },
  {
    timestamps: true,
  }
);

const Journal = model("Journal", journalSchema);

module.exports = Journal