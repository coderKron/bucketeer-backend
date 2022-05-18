const router = require("express").Router();
const authRoutes = require("./auth.routes");
const { isAuthenticated } = require("../middleware/jwt.middelware");
/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
