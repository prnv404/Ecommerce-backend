const CustomError = require('../errors')

const checkPermission = (requestUser, resourceUserId) => {
	if (requestUser === 'admin') return
	if (requestUser === resourceUserId.toString()) return
	throw new CustomError.UnauthenticatedError('Not authorized to this route')
}

module.exports = checkPermission