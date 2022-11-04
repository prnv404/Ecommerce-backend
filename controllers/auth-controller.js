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

	const verificationToken = 'verification token'

	const user = await User.create({
		name,
		email,
		password,
		role,
		verificationToken,
	})

	res.status(StatusCodes.CREATED).josn({
		message: 'Please verify your email to verify account',
		verificationToken,
	})
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

	if (!user.isVerified === true) {
		throw new CustomError.UnauthenticatedError('Please verify your account')
	}

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

const verifyEmail = async (req, res) => {
	const { verificationToken, email } = req.body

	if (!verificationToken || !email) {
		throw new CustomError.BadRequestError('Please provide all Values')
	}

	const user = await User.findOne(email)
	if (!user) {
		throw new CustomError.NotFoundError('NO user found')
	}
	const userVerificationToken = user.verificationToken

	if (!userVerificationToken === verificationToken) {
		throw new CustomError.BadRequestError('Token dosent match')
	}

	user.isVerified = true

	user.isVerified = Date.now()

	user.verificationToken = ''

	await user.save()

	res.status(StatusCodes.OK).json({ msg: 'user verified' })
}

module.exports = {
	register,
	login,
	logout,
	verifyEmail,
}
