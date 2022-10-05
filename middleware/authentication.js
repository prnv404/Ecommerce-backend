const CustomError = require('../errors')
const { isTokenValid } = require('../utils')

const authenticateUser = async (req, res, next) => {
	const token = req.signedCookies.token
	console.log(token)
	if (!token) {
		throw new CustomError.UnauthenticatedError('Token invalid')
	}
	try {
		const payload = isTokenValid({ token })
		console.log(payload)
		// req.user = { name, userId, role }
		next()
	} catch (error) {
		throw new CustomError.UnauthenticatedError('Token invalid')
	}
}

module.exports = authenticateUser
