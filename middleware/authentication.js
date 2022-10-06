const CustomError = require('../errors')
const { isTokenValid } = require('../utils')

/**
 * It checks if the token is valid and if it is, it adds the user to the request object
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a function that you call when you want to move on to the next middleware.
 */
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

/**
 * It takes in a list of roles and returns a function that takes in a request, response, and next
 * function. If the user's role is not in the list of roles, it throws an error. Otherwise, it calls
 * the next function
 * @param roles - An array of roles that are allowed to access the route.
 * @returns A function that takes in 3 parameters (req, res, next)
 */
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
