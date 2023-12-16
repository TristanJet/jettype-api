// import services
const service = require('./services/signup.service')


const signupcontroller = async (req, res, next) => {
		try {
			await service(req.body.credential)
			res.json({
				message: 'signup successful',
				timestamp: new Date().toISOString(),
				IP: req.ip,
				URL: req.originalUrl,
			})
		}
		catch (err) {
			return next(err);
		}
}

module.exports = {
  signupcontroller,
}

