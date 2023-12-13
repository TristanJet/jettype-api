// import services
const verify = require('./services/google-verify.service')


const signup = async (req, res) => {
		try {
			const decoded = await verify(req.body.credential)
			console.log(decoded)
			res.json({
				message: 'signup successful',
				timestamp: new Date().toISOString(),
				IP: req.ip,
				URL: req.originalUrl,
			})
		}
		catch (err) {
		res.status(500).send(err)
		}
}

module.exports = {
  signup,
}

