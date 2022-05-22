const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");
const Bucket = require("../models/Bucket.model");
const Kicks = require("../models/Kicks.model");
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

//POST - api/bucket  - create a new bucket
router.post(
  "/bucket",
  isAuthenticated,
  parser.single("picture"),
  (req, res, next) => {
    const { name, description } = req.body;
    const picture = req.file?.path;

    const newBucket = {
      name,
      description,
      picture,
      kicks: [],
      likes: [],
      user: req.payload._id,
      comments: [{}],
    };

    Bucket.create(newBucket)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((err) => {
        console.log("Error creating a new bucket", err);
        res.status(500).json({
          message: "error creating new bucket",
          error: err,
        });
      });
  }
);

//GET - api/bucket - Get a list of buckets based on the user

router.get("/bucket", isAuthenticated, (req, res, next) => {
  Bucket.find({ user: req.payload._id })
    .populate("kicks")
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log("error getting list of buckets", err);
      res.status(500).json({
        message: "error getting list of buckets",
        error: err,
      });
    });
});

router.get("/bucket/:bucketId", isAuthenticated, (req, res, next) => {
  const bucketId = req.params.bucketId;
  console.log(bucketId);
  Bucket.findById(bucketId)
    .populate("kicks")
    .then((response) => {
      if (response.user == req.payload._id) {
        res.json(response);
      } else {
        res.status(403).json({
          message: "Only the user that created the bucket can see it",
        });
      }
    })
    .catch((err) => {
      console.log("error getting list of buckets", err);
      res.status(500).json({
        message: "error getting list of buckets",
        error: err,
      });
    });
});

//PUT - api/bucket/:bucketid - Update bucket-kicks when you are in kicks list -  only the user that created it can do this
router.put("/bucket/:bucketId/add", isAuthenticated, (req, res, next) => {
  const { bucketId } = req.params;
  const kickId = req.body.kickId;
  if (!mongoose.Types.ObjectId.isValid(bucketId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Bucket.findById(bucketId)
    .then((response) => {
      response.user == req.payload._id
        ? Bucket.findByIdAndUpdate(
            bucketId,
            { $addToSet: { kicks: kickId } },
            { new: true }
          ).then((updatedBucket) => res.json(updatedBucket))
        : res.status(403).json({
            message: "Only the user that created the bucket can edit it",
          });
    })

    .catch((err) => {
      console.log("error updating bucket", err);
      res.status(500).json({
        message: "error updating bucket",
        error: err,
      });
    });
});

router.put("/bucket/:bucketId", isAuthenticated, (req, res, next) => {
  const { bucketId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bucketId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Bucket.findById(bucketId)
    .then((response) => {
      response.user == req.payload._id
        ? Bucket.findByIdAndUpdate(bucketId, req.body, { new: true }).then(
            (updatedBucket) => res.json(updatedBucket)
          )
        : res.status(403).json({
            message: "Only the user that created the bucket can edit it",
          });
    })

    .catch((err) => {
      console.log("error updating bucket", err);
      res.status(500).json({
        message: "error updating bucket",
        error: err,
      });
    });
});
router.put(
  "/bucket/:bucketId/remove/kick",
  isAuthenticated,
  (req, res, next) => {
    const { bucketId } = req.params;
    console.log(req.body);
    if (!mongoose.Types.ObjectId.isValid(bucketId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Bucket.findById(bucketId)
      .then((response) => {
        response.user == req.payload._id
          ? Bucket.findByIdAndUpdate(
              bucketId,
              { $pull: { kicks: req.body.kickId } },
              { new: true }
            ).then((updatedBucket) => res.json(updatedBucket))
          : res.status(403).json({
              message: "Only the user that created the bucket can edit it",
            });
      })

      .catch((err) => {
        console.log("error updating bucket", err);
        res.status(500).json({
          message: "error updating bucket",
          error: err,
        });
      });
  }
);

//DELETE - api/bucket/:bucketid - only the person that created the bucket can delete it
router.delete("/bucket/:bucketId", isAuthenticated, (req, res, next) => {
  const { bucketId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bucketId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Bucket.findById(bucketId)
    .then((response) => {
      response.user == req.payload._id
        ? Bucket.findByIdAndRemove(bucketId).then((deletedBucket) =>
            res.json({
              message: `The bucket with id ${bucketId} has now been deleted`,
            })
          )
        : res.status(403).json({
            message: "Only the user that created the bucket can delete it",
          });
    })

    .catch((err) => {
      console.log("error deleting bucket", err);
      res.status(500).json({
        message: "error deleting bucket",
        error: err,
      });
    });
});

// storage: storage
module.exports = multer({ storage });

module.exports = router;
