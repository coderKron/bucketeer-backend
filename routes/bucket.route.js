const express = require('express')
const router = express.Router()
const {default: mongoose} = require('mongoose')
const Bucket = require('../models/Bucket.model')
const Kicks = require('../models/Kicks.model')
const {isAuthenticated} = require('../middleware/jwt.middelware')

//POST - api/bucket  - create a new bucket
router.post("/bucket", isAuthenticated, (req, res, next) => {
    const {name, description} = req.body
    console.log(">>>>>>>", req.payload._id); 

    const newBucket = {
        name,
        description,
        pictures: [],
        kicks: [],
        likes: [],
        user: req.payload._id,        
        comments: [{}],
    }

  Bucket.create(newBucket)
  .then(response => { 
    console.log(">>>>>>>", req.payload);  
    res.status(201).json(response)})  
  .catch(err => { 
      console.log("Error creating a new bucket", err)
        res.status(500).json({
            message: "error creating new bucket",
            error: err
        })
    })
})

//GET - api/bucket - Get a list of buckets
 
router.get("/bucket", isAuthenticated, (req, res, next) => {
    Bucket.find({user: req.payload._id})
    .populate("kicks")
    .then(response => {
        res.json(response)
    })
    .catch((err) => {
        console.log("error getting list of buckets", err);
        res.status(500).json({
          message: "error getting list of buckets",
          error: err,
        });
      });
})

//PUT - api/bucket/:bucketid   

//DELETE - api/bucket/:bucketid   

module.exports = router;