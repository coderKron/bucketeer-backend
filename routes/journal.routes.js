const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");
const Bucket = require("../models/Bucket.model");
const User = require("../models/User.model");
const Journal = require("../models/Journal.model");
const { isAuthenticated } = require("../middleware/jwt.middelware");
const { route } = require("../app");

//POST - api/journal - create a new journal

router.post("/journal", isAuthenticated, (req, res, next) => {
  const { title, description, visibility, bucketId } = req.body;

  const newJournal = {
    title,
    description,
    createdBy: req.payload._id,
    bucket: bucketId,
    visibility,
  };

  Journal.create(newJournal)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((err) => {
      console.log("Error creating a new journal", err);
      res.status(500).json({
        message: "error creating new journal",
        error: err,
      });
    });
});

//GET - api/journal - get a list of all journals, that are public

router.get("/journal/public", (req, res, next) => {
  Journal.find({ visibility: "Public" })
    .populate("createdBy")
    .populate("story")
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log("error getting list of journals", err);
      res.status(500).json({
        message: "error getting list of journals",
        error: err,
      });
    });
});

//GET - api/journal/:userId - get a list of all journals for a user

router.get("/journal/private", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  Journal.find({ createdBy: userId })
    .populate("story")
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log("error getting list of journals", err);
      res.status(500).json({
        message: "error getting list of journals",
        error: err,
      });
    });
});

//GET - api/journal/:journalId - get a single journal

router.get("/journal/:journalId", (req, res, next) => {
  const journalId = req.params.journalId;
  Journal.findById(journalId)
    .populate("story")
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log("error getting the journal", err);
      res.status(500).json({
        message: "error getting the journal",
        error: err,
      });
    });
});

//PUT - api/journal/:journalId - update journal

//PUT - api/journal/:journalId/remove - remove story from a journal

router.put(
  "/journal/:journalId/remove/story",
  isAuthenticated,
  (req, res, next) => {
    const journalId = req.params.journalId;

    if (!mongoose.Types.ObjectId.isValid(journalId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Journal.findById(journalId)
    .then((response) => {
      response.createdBy == req.payload._id
        ? Journal.findByIdAndUpdate(
            journalId,
            { $pull: { story: req.body.storyId } },
            { new: true }
          ).then((updatedBucket) => res.json(updatedBucket))
        : res.status(403)
            .json({
              message: "Only the user that created the journal can delete a story from it",
            })
            .catch((err) => {
              console.log("error updating journal", err);
              res.status(500).json({
                message: "error updating journal",
                error: err,
              });
            });
    });
  }
);

//DELETE - api/journal/:journalId - delete journal
router.delete("/journal/:journalId", isAuthenticated, (req, res, next) => {
  const journalId = req.params.journalId;

  if (!mongoose.Types.ObjectId.isValid(journalId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Journal.findById(journalId)
    .then((response) => {
      response.createdBy == req.payload._id
        ? Journal.findByIdAndDelete(journalId).then((deletedJournal) =>
            res.json({
              message: `The journal with the id ${journalId} was deleted`,
            })
          )
        : res.status(403).json({
            message: "Only the user that created the Journal can delete it",
          });
    })
    .catch((err) => {
      console.log("error deleting the journal", err);
      res.status(500).json({
        message: "error deleting the journal",
        error: err,
      });
    });
});

module.exports = router;
