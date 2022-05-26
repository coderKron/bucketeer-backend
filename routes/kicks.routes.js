const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");
const Bucket = require("../models/Bucket.model");
const Kicks = require("../models/Kicks.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middelware");
const { response } = require("../app");

// config/cloudinary.config.js

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const { route } = require("./auth.routes");

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

// POST - api/kicks - create a new kick

router.post("/kick", isAuthenticated, (req, res, next) => {
  const {
    name,
    continent,
    location,
    country,
    category,
    description,
    pictures,
    buckets,
  } = req.body;

  const newKick = {
    name,
    continent,
    location,
    country,
    category,
    description,
    pictures,
    buckets: [],
    createdBy: req.payload._id,
    doneBy: [],
    likes: [],
  };
  console.log(newKick);
  Kicks.create(newKick)
    .then((response) => {
      console.log(req.payload);

      res.status(201).json(response);
      return response;
    })
    .then((response) => {
      console.log(response);
      console.log(buckets);
      return Bucket.findByIdAndUpdate(
        buckets,
        { $addToSet: { kicks: response._id } },
        { new: true }
      );
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

router.get("/kick/:kickId", isAuthenticated, (req, res, next) => {
  const kickId = req.params.kickId;
  Kicks.findById(kickId)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

// PUT - api/kick/:kickId - Update a Kick - only the user that created it can do this

router.put(
  "/kick/:kickId",
  parser.single("picture"),
  isAuthenticated,
  (req, res, next) => {
    const { kickId } = req.params;
    let kick;
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
        response.createdBy == req.payload._id
          ? Kicks.findByIdAndUpdate(kickId, req.body, { new: true }).then(
              (updatedKick) => res.json(updatedKick)
            )
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
  }
);

// GET - api/kick/:bucketId - get kicks from a bucket
// router.get('/kick/:bucketId', (req, res, next) => {
//   const bucketId = req.params.bucketId

//  Bucket.findById(bucketId)
//   .populate("kicks")
//   .then((bucket) => {
//   console.log("bbboooo"),
//   res.json(bucket)}
//   )
//   .catch((err) => {
//     console.log("error getting kicks from bucket", err);
//     res.status(500).json({
//       message: "error getting kicks from bucket",
//       error: err,
//     });
//   });

// })

// PUT - api/kick/:kickId/add - User can add ANY kick to the specified

router.put("/kick/:kickId/add", isAuthenticated, (req, res, next) => {
  const { kickId } = req.params;
  const { bucketId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(kickId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Kicks.findById(kickId)
    .then((kick) => {
      console.log(kick), console.log(">>>>>>> bucket ID", bucketId);
      console.log(">>>>>>>> kick ID", kick._id);
      return Bucket.findByIdAndUpdate(
        bucketId,
        { $push: { kicks: kick._id } },
        { new: true }
      );
    })
    .then((updatedBucket) => {
      console.log(">>>>>>>> UPDATED BUCKET", updatedBucket),
        res.json(updatedBucket);
    })
    .catch((err) => {
      console.log("error adding kicks to bucket", err);
      res.status(500).json({
        message: "error adding kicks to bucket",
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
        : res.status(403).json({
            message: "Only the user that created the kick can edit it",
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

module.exports = multer({ storage });
module.exports = router;
