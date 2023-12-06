const express = require('express');

// import all the routes here

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

//router.get('leaderboard')

//router.post('gamestate')

//router.get('user')

//router.get('leaderboard')

module.exports = router;