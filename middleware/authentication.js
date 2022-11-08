const CustomError = require('../errors')
const { isTokenValid } = require('../utils')
const Token = require('../models/token-model')
const { attachCookiesToResponse } = require('../utils')

const authenticateUser = async (req, res, next) => {
	const { refreshToken, accessToken } = req.signedCookies

	try {
		if (accessToken) {
			const payload = isTokenValid({ token: accessToken })
			console.log('ok')
			req.user = payload.user
			return next()
		}
		const payload = isTokenValid({ token: refreshToken })

		const existingToken = await Token.findOne({
			user: payload.user.userId,
			refreshToken: payload.refreshToken,
		})

		if (!existingToken || !existingToken.isValid) {
			console.log('ok')
			throw new CustomError.UnauthenticatedError('Authentication Invalid')
		}

		attachCookiesToResponse({
			res,
			user: payload.user,
			refreshToken: existingToken.refreshToken,
		})

		req.user = payload.user

		next()
	} catch (error) {
		throw new CustomError.UnauthenticatedError('hello')
	}
}

const authorizePermission = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new CustomError.UnauthorizedError(
				'Unauthorized to access this route'
			)
		}
		next()
	}
}

module.exports = {
	authenticateUser,
	authorizePermission,
}
