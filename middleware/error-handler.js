const { StatusCodes } = require('http-status-codes')

/**
 * It takes an error object, checks if it's a mongoose validation error, a duplicate key error, or a
 * cast error, and returns a custom error message with a status code
 * @param err - The error object that was thrown.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a function that you call when you want to move on to the next middleware.
 * @returns a function that takes in 4 parameters.
 */
const errorHandlerMiddleware = (err, req, res, next) => {
	console.log(err)
	let customError = {
		// set default
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Something went wrong try again later',
	}
	if (err.name === 'ValidationError') {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(',')
		customError.statusCode = 400
	}
	if (err.code && err.code === 11000) {
		customError.msg = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)} field, please choose another value`
		customError.statusCode = 400
	}
	if (err.name === 'CastError') {
		customError.msg = `No item found with id : ${err.value}`
		customError.statusCode = 404
	}

	return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
