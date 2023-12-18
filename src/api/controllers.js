// import services
const signup = require('./services/signup.service')


const signupcontroller = async (req, res, next) => {
		try {
			const userId = await signup.user(req.body.credential)
			const sessionId = await signup.session(userId)
			res.cookie('jet-session', sessionId, {
				maxAge: (2600000 * 1000),
				httpOnly: true,
				secure: true,
				sameSite: 'Lax',
			})
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

