const { StatusCodes } = require('http-status-codes')
const User = require('../models/user-model')
const CustomError = require('../errors')
const { createTokenUser, attachCookiesToResponse } = require('../utils')

/**
 * It creates a new user and returns a token
 * @param req - The request object.
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

	const tokenUser = createTokenUser(user)

	attachCookiesToResponse({ res, user: tokenUser })

	res.status(StatusCodes.CREATED).json({ tokenUser })
}

/**
 * It takes in a request and a response, and returns a tokenUser object
 * @param req - The request object.
 * @param res - The response object.
 */

const login = async (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		throw new CustomError.BadRequestError('please provide email and password')
	}

	const user = await User.findOne({ email })

	if (!user) {
		throw new CustomError.UnauthenticatedError('Invalid Crendtials')
	}

	const isMatch = await user.comparePassword(password)

	if (!isMatch) {
		throw new CustomError.UnauthenticatedError('Incorrect Password')
	}

	const tokenUser = createTokenUser(user)

	attachCookiesToResponse({ res, user: tokenUser })

	res.status(StatusCodes.CREATED).json({ tokenUser })
}
/**
 * It sets the cookie to 'logout' and expires it immediately
 * @param req - The request object.
 * @param res - The response object.
 */

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
