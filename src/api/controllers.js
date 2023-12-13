// import services


exports.signup = async (req, res) => {
		try {
			const id = req.params.id
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

