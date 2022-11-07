const { StatusCodes } = require('http-status-codes')
const crypto = require('crypto')
const User = require('../models/user-model')
const Token = require('../models/token-model')

const CustomError = require('../errors')

const {
	createTokenUser,
	attachCookiesToResponse,
	sendVerificationEmail,
	sendResetPassswordEmail,
	createHash,
} = require('../utils')

/**
 * It creates a new user and sends a verification email to the user
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

	const verificationToken = crypto.randomBytes(40).toString('hex')

	const user = await User.create({
		name,
		email,
		password,
		role,
		verificationToken,
	})

	const origin = req.get('origin')

	await sendVerificationEmail({
		name: user.name,
		email: user.email,
		verificationToken: user.verificationToken,
		origin,
	})

	res.status(StatusCodes.CREATED).json({
		message: 'Please verify your email to verify account',
	})
}

/**
 * It logs in a user and returns a token
 * @param req - The request object.
 * @param res - The response object
 * @returns The user object is being returned.
 */

const login = async (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		throw new CustomError.BadRequestError('Please provide email and password')
	}

	const user = await User.findOne({ email })

	if (!user) {
		throw new CustomError.UnauthenticatedError('Invalid Credentials')
	}

	const isPasswordCorrect = await user.comparePassword(password)

	if (!isPasswordCorrect) {
		throw new CustomError.UnauthenticatedError('Invalid Credentials')
	}

	if (!user.isVerified) {
		throw new CustomError.UnauthenticatedError('Please verify your email')
	}

	const tokenUser = createTokenUser(user)

	// create refresh token
	let refreshToken = ''
	// check for existing token
	const existingToken = await Token.findOne({ user: user._id })

	if (existingToken) {
		const { isValid } = existingToken

		if (!isValid) {
			throw new CustomError.UnauthenticatedError('Invalid Credentials')
		}

		refreshToken = existingToken.refreshToken

		attachCookiesToResponse({ res, user: tokenUser, refreshToken })

		res.status(StatusCodes.OK).json({ user: tokenUser })

		return
	}

	refreshToken = crypto.randomBytes(40).toString('hex')

	const userAgent = req.headers['user-agent']

	const { ip } = req

	const userToken = { refreshToken, ip, userAgent, user: user._id }

	await Token.create(userToken)

	attachCookiesToResponse({ res, user: tokenUser, refreshToken })

	res.status(StatusCodes.OK).json({ user: tokenUser })
}

/**
 * It verifies a user's email address
 * @param req - The request object.
 * @param res - The response object.
 */

const verifyEmail = async (req, res) => {
	const { verificationToken, email } = req.body

	if (!verificationToken || !email) {
		throw new CustomError.BadRequestError('Please provide all Values')
	}

	const user = await User.findOne({ email })

	if (!user) {
		throw new CustomError.NotFoundError('NO user found')
	}

	if (user.verificationToken !== verificationToken) {
		throw new CustomError.BadRequestError('Token dosent match')
	}

	user.isVerified = true

	user.verified = Date.now()

	user.verificationToken = ''

	await user.save()

	res.status(StatusCodes.OK).json({ msg: 'user verified' })
}

/**
 * It deletes the token from the database and clears the cookies
 * @param req - The request object.
 * @param res - The response object.
 */

const logout = async (req, res) => {
	await Token.findOneAndDelete({ user: req.user.userId })

	res.cookie('accessToken', 'logout', {
		httpOnly: true,
		expires: new Date(Date.now()),
	})

	res.cookie('refreshToken', 'logout', {
		httpOnly: true,
		expires: new Date(Date.now()),
	})

	res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

/**
 * It takes an email from the request body, finds the user with that email, creates a password token,
 * sends an email with the password token, saves the password token to the user, and returns a message
 * to the user
 * @param req - The request object.
 * @param res - The response object.
 */

const forgotPassword = async (req, res) => {
	const { email } = req.body

	if (!email) {
		throw new CustomError.BadRequestError('Please provide valid email')
	}

	const user = await User.findOne({ email })

	if (user) {
		const passwordToken = crypto.randomBytes(70).toString('hex')
		// send email
		const origin = 'http://localhost:3000'
		await sendResetPassswordEmail({
			name: user.name,
			email: user.email,
			token: passwordToken,
			origin,
		})

		const tenMinutes = 1000 * 60 * 10

		const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)

		user.passwordToken = createHash(passwordToken)

		user.passwordTokenExpirationDate = passwordTokenExpirationDate

		await user.save()
	}

	res
		.status(StatusCodes.OK)
		.json({ msg: 'Please check your email for reset password link' })
}

/**
 * It resets the password of a user if the token is valid
 * @param req - The request object.
 * @param res - The response object.
 */

const resetPassword = async (req, res) => {
	const { token, email, password } = req.body

	if (!token || !email || !password) {
		throw new CustomError.BadRequestError('Please provide all values')
	}

	const user = await User.findOne({ email })

	if (user) {
		const currentDate = new Date()

		if (
			user.passwordToken === createHash(token) &&
			user.passwordTokenExpirationDate > currentDate
		) {
			user.password = password
			user.passwordToken = null
			user.passwordTokenExpirationDate = null
			await user.save()
		}
	}

	res.send('reset password')
}

module.exports = {
	verifyEmail,
	register,
	login,
	logout,
	forgotPassword,
	resetPassword,
}
