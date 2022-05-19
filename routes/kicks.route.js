const express = require("express");
const router = express.Router()
const {default: mongoose} = require("mongoose")
const Bucket = require("../models/Bucket.model");
const Kicks = require("../models/Kicks.model");
const { isAuthenticated } = require("../middleware/jwt.middelware");

// POST - api/kicks - create a new kick

router.post("/kick", isAuthenticated, (req, res, next) => {
    const {name, location, category, description, buckets} = req.body;

    const newKick = {
        name,
        location,
        category,
        description,
        pictures: [],
        buckets: [],
        createdBy: req.payload._id,
        doneBy: [],
        likes: []
    }

    Kicks.create(newKick)
    .then(response => {
        res.status(201).json(response)
        })
    
    
    .catch((err) => {
        console.log("Error creating a new kick", err);
        res.status(500).json({
          message: "error creating new kick",
          error: err,
        });
      });
})

// GET - api/kick - Display all Kicks 

router.get("/kick", (req, res, next) => {
    Kicks.find()
    .then(response => {
        res.json(response)
    })
    .catch((err) => {
        console.log("error getting list of kicks", err);
        res.status(500).json({
          message: "error getting list of kicks",
          error: err,
        });
      });

})



module.exports = router