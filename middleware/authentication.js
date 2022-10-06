const CustomError = require('../errors')
const { isTokenValid } = require('../utils')

const authenticateUser = async (req, res, next) => {
	const token = req.signedCookies.token
	// console.log(req.signedCookies)
	if (!token) {
		throw new CustomError.UnauthenticatedError('Token Error')
	}
	try {
		const payload = isTokenValid({ token })
		req.user = payload
		next()
	} catch (error) {
		throw new CustomError.UnauthenticatedError('Token Error')
	}
}

const authorizePermission = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new CustomError.UnauthenticatedError(
				'Unauthorize to access to this route'
			)
		}
		next()
	}
}

module.exports = { authenticateUser, authorizePermission }
