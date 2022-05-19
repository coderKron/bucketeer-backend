const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");
const Bucket = require("../models/Bucket.model");
const Kicks = require("../models/Kicks.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middelware");
const { response } = require("../app");

// POST - api/kicks - create a new kick

router.post("/kick", isAuthenticated, (req, res, next) => {
  const { name, location, category, description, buckets } = req.body;

  const newKick = {
    name,
    location,
    category,
    description,
    pictures: [],
    buckets: [],
    createdBy: req.payload._id,
    doneBy: [],
    likes: [],
  };

  Kicks.create(newKick)
    .then((response) => {
        console.log(req.payload)
      res.status(201).json(response);
    })

    .catch((err) => {
      console.log("Error creating a new kick", err);
      res.status(500).json({
        message: "error creating new kick",
        error: err,
      });
    });
});

// GET - api/kick - Display all Kicks

router.get("/kick", (req, res, next) => {
  Kicks.find()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log("error getting list of kicks", err);
      res.status(500).json({
        message: "error getting list of kicks",
        error: err,
      });
    });
});

// PUT - api/kick/:kickId - Update a Kick - only the user that created it can do this

router.put("/kick/:kickId", isAuthenticated, (req, res, next) => {
  const { kickId } = req.params;
    let kick
  if (!mongoose.Types.ObjectId.isValid(kickId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Kicks.findById(kickId)
//   .populate("createdBy")
    .then((response) => {
    //     kick = response
    //      return User.findById(req.payload._id)})
    // .then(user => {
    //     if (kick.createdBy == user._id){
        response.createdBy == req.payload._id ?
         Kicks.findByIdAndUpdate(kickId, req.body, { new: true })
         .then((updatedKick) => res.json(updatedKick))
        
            : res.status(403).json({
            message: "Only the user that created the kick can edit it",
          });
        
    })
    .catch((err) => {
      console.log("error updating kick", err);
      res.status(500).json({
        message: "error updating kick",
        error: err,
      });
    });
});

//DELETE - api/kick/:kickid - only the person that created the kick can delete it
router.delete("/kick/:kickId", isAuthenticated, (req, res, next) => {
  const { kickId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(kickId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Kicks.findById(kickId)
    .then((response) => {

      response.createdBy == req.payload._id
        ? Kicks.findByIdAndRemove(kickId).then((deletedKick) =>
            res.json({
              message: `The kick with id ${kickId} has now been deleted`,
            })
          )
        : res
            .status(403)
            .json({
              message: "Only the user that created the kcik can edit it",
            });
    })
    .catch((err) => {
      console.log("error deleting kick", err);
      res.status(500).json({
        message: "error deleting kick",
        error: err,
      });
    });
});

module.exports = router;
