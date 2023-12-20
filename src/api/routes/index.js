const express = require("express");

const schemas = require("../schemas");

const validate = require("../middlewares/validate");

const controllers = require("../controllers");

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/", (req, res) => {
  res.json({
    message: "OK",
    timestamp: new Date().toISOString(),
    IP: req.ip,
    URL: req.originalUrl,
  });
});

//router.get('/leaderboard')

//router.get('/alltime')

router.post("/signin", validate(schemas.signupSchema), controllers.signin);

router.get("/auth", controllers.auth)

router.post("/gamestate", (req, res) => {
  console.log(req.body);
  res.json({
    message: "post successful",
    timestamp: new Date().toISOString(),
    IP: req.ip,
    URL: req.originalUrl,
  });
});

//router.get('/user')

module.exports = router;
