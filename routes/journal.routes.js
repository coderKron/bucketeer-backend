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


//GET - api/journal - get a list a all journal, that are public


//GET - api/journal/:journalId - get a single journal 

router.get("/journal/:journalId", isAuthenticated, (req, res, next) => {
  const journalId = req.params.journalId
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

//DELETE - api/journal/:journalId - delete journal

module.exports = router;
