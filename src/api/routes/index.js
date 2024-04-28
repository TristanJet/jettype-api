const express = require('express');

const schemas = require('../schemas');

const validate = require('../middlewares/validate');

const auth = require('../middlewares/auth')

const controllers = require('../controllers');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/', (req, res) => {
  res.json({
    message: 'OK',
    timestamp: new Date().toISOString(),
    IP: req.ip,
    URL: req.originalUrl,
  });
});

router.get('/leaderboard', controllers.leaderboard);

// router.get('/alltime')

router.post('/signin', validate(schemas.signupSchema), controllers.signin);

router.get('/auth', controllers.auth);

router.get('/user', auth, controllers.user)

module.exports = router;
