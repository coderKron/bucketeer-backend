const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middelware");
const { response } = require("../app");

// config/cloudinary.config.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ['jpg', 'png'],
    folder: 'bucketeers' // The name of the folder in cloudinary
    // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
  }
});

const parser = multer({ storage: storage })


//PUT:userId - api/user/:userId - Update user details

router.put("/user/:userId", isAuthenticated, parser.single("picture"), (req, res, next) => {
  const {userId} = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findByIdAndUpdate(userId, req.body, {new:true})
  .then(updatedUser => res.json(updatedUser))
  .catch((err) => {
    console.log("error updating user", err)
    res.status(500).json({ 
      message: "error updating user", 
      error: err,
    })
  })
})



module.exports = multer({ storage });

module.exports = router;

