const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");
const Journal = require("../models/Journal.model");
const Story = require("../models/Story.model");
const { isAuthenticated } = require("../middleware/jwt.middelware");

// config/cloudinary.config.js

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ["jpg", "png"],
    folder: "bucketeers", // The name of the folder in cloudinary
    // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
  },
});

const parser = multer({ storage: storage });


//POST - api/story/:journalId  - create a new story entry

router.post(
  "/story/:journalId",
  isAuthenticated,
  parser.single("picture"),
  (req, res, next) => {
    const { title, content, pictures } = req.body;
    const { journalId } = req.params;

    const newStory = {
      title,
      journalId,
      content,
      pictures,
      createdBy: req.payload._id,
    };
    Journal.findById(journalId)
      .then((response) => {
        response.createdBy == req.payload._id
          ? Story.create(newStory).then((response) => {
              Journal.findByIdAndUpdate(
                journalId,
                { $addToSet: { story: response._id } },
                { new: true }
              ).then((updatedJournal) => res.json(updatedJournal));
            })
          : res.status(403).json({
              message: "Only the user that created the journal can add a story",
            });
      })
      .catch((err) => {
        console.log("Error creating a new journal", err);
        res.status(500).json({
          message: "error creating new journal",
          error: err,
        });
      });
  }
);

//GET - api/story/:journalId  - get storys from journal

router.get('/story/:journalId', isAuthenticated, (req, res, next) => {
  const journalId = req.params.journalId
  Journal.findById(journalId)
  .populate("story")
  .then((response) => res.json(response))
  .catch((err) => {
    console.log("error getting list of storys", err);
    res.status(500).json({
      message: "error getting list of storys",
      error: err,
    });
  });
})

//DELETE - api/story/:storyId - delete story - only user that created the story can delete it

router.delete("/story/:storyId", isAuthenticated, (req, res, next) => {
  const storyId = req.params.storyId

  if (!mongoose.Types.ObjectId.isValid(journalId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Story.findById(storyId)
  .then((response) => {
    response.createdBy == req.payload._id
    ? Story.findByIdAndDelete(storyId).then((deletedStory) => 
    res.json({
      message: `The story with the id ${storyId} was deleted`,
    })
    )
    : res.status(403).json({
      message: "Only the user that created the story can delete it"
    })
  })
  .catch((err) => {
    console.log("error deleting the story", err);
    res.status(500).json({
      message: "error deleted the story",
      error: err,
    });
  });
})


// storage: storage
module.exports = multer({ storage });

module.exports = router;
