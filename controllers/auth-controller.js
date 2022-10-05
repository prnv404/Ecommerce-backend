const User = require('../models/user-model')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { createJWT, attachCookiesToResponse } = require('../utils')

/**
 * It creates a new user and returns a token via cookies
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 */
const register = async (req, res) => {
	const { email, name, password } = req.body

	const emailExist = await User.findOne({ email })
	if (emailExist) {
		throw new CustomError.BadRequestError('Email already exist')
	}

	const isFirstAccount = (await User.countDocuments({})) === 0
	const role = isFirstAccount ? 'admin' : 'user'

	const user = await User.create({ name, email, password, role })
	const tokenUser = {
		user: { name: user.name, userId: user._id, role: user.role },
	}
	attachCookiesToResponse({ res, user: tokenUser })
	res.status(StatusCodes.CREATED).json({ tokenUser })
}

/**
 * It's a function that takes in a request and a response object, and sends back a string of text
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const login = async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		throw new CustomError.BadRequestError(
			'please provide email and password'
		)
	}
	const user = await User.findOne({ email })
	if (!user) {
		throw new CustomError.UnauthenticatedError('Invalid Crendtials')
	}

	const isMatch = await user.comparePassword(password)
	if (!isMatch) {
		throw new CustomError.UnauthenticatedError('Incorrect Password')
	}
	const tokenUser = {
		user: { name: user.name, userId: user._id, role: user.role },
	}

	attachCookiesToResponse({ res, user: tokenUser })
	res.status(StatusCodes.CREATED).json({ tokenUser })
}

const logout = async (req, res) => {
	res.cookie('token', 'logout', {
		httpOnly: true,
		expires: new Date(Date.now()),
	})
	res.status(StatusCodes.OK).json({ msg: 'logout succesfully' })
}

module.exports = {
	register,
	login,
	logout,
}
