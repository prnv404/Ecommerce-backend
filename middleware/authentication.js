const CustomError = require('../errors')
const { isTokenValid } = require('../utils')

const authenticateUser = async (req, res, next) => {
	const token = req.signedCookies.token
	// console.log(token)
	if (!token) {
		throw new CustomError.UnauthenticatedError('Token invalid')
	}
	try {
		const {
			user: { name: name, userId: userId, role: role },
		} = isTokenValid({ token })
		req.user = { name, userId, role }
		next()
	} catch (error) {
		throw new CustomError.UnauthenticatedError('Token invalid')
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
