const { StatusCodes } = require('http-status-codes')
const crypto = require('crypto')
const { OAuth2Client } = require('google-auth-library')
const User = require('../models/user-model')
const Token = require('../models/token-model')

const CustomError = require('../errors')

const {
	createTokenUser,
	attachCookiesToResponse,
	sendVerificationEmail,
	sendResetPassswordEmail,
	createHash,
	verifyOTP,
	createOTP,
} = require('../utils')

/**
 * It creates a new user and sends a verification email to the user
 * @param req - The request object.
 * @param res - The response object.
 */

const register = async (req, res) => {
	const { email, name, password, mobNumber } = req.body

	if (email) {
		const emailExist = await User.findOne({ email })

		if (emailExist) {
			throw new CustomError.BadRequestError('Email already exist')
		}
	}

	if (mobNumber) {
		const numberExist = await User.findOne({ mobNumber })

		if (numberExist) {
			throw new CustomError.BadRequestError('Mobile Number already exist')
		}
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
		mobNumber,
	})

	const origin = req.get('origin')

	if (email) {
		await sendVerificationEmail({
			name: user.name,
			email: user.email,
			verificationToken: user.verificationToken,
			origin,
		})
	}

	if (mobNumber) {
		await createOTP({ phoneNumber: mobNumber, channel: 'sms' })
		res.status(StatusCodes.CREATED).json({
			message: 'Please verify your Mobile Number to verify account',
		})
		return
	}

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
	const { mobNumber, email, password } = req.body

	if (!password) {
		throw new CustomError.BadRequestError('Please provide password')
	}

	if (!mobNumber && !email) {
		throw new CustomError.BadRequestError(
			'Please provide email or mobile number'
		)
	}

	let user

	if (email) {
		user = await User.findOne({ email })
	}

	if (mobNumber) {
		user = await User.findOne({ mobNumber })
	}

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
const verifyNumber = async (req, res) => {
	const { mobNumber, OTP } = req.body

	if (!mobNumber || !OTP) {
		throw new CustomError.BadRequestError('Please provide all values')
	}

	const user = await User.findOne({ mobNumber })

	if (!user) {
		throw new CustomError.NotFound('No user found')
	}

	const verify = await verifyOTP({ phoneNumber: mobNumber, code: OTP })

	const { valid } = verify

	if (!valid === true) {
		throw new CustomError.BadRequestError('Incorrect OTP')
	}

	user.isVerified = true

	user.verified = Date.now()

	user.verificationToken = ''

	await user.save()

	res.status(StatusCodes.OK).json({ message: 'Please Login' })
}

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

/**
 * It takes in a request object, verifies the user's Google token, and returns a response object with a
 * user object and a refresh token
 * @param req - The request object
 * @param res - The response object
 */

const googleSignUser = async (req, res) => {
	try {
		const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
		const ticket = await client.verifyIdToken({
			idToken: req.body?.credential,
			audience: process.env.GOOGLE_CLIENT_ID,
		})

		const payload = ticket.getPayload()

		const { email, name } = payload

		const user = await User.findOne({ email })

		const tokenUser = createTokenUser(user)

		let refreshToken = ''

		if (user) {
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
		} else {
			refreshToken = crypto.randomBytes(40).toString('hex')

			const userAgent = req.headers['user-agent']

			const { ip } = req

			const userToken = { refreshToken, ip, userAgent, user: user._id }

			await Token.create(userToken)

			attachCookiesToResponse({ res, user: tokenUser, refreshToken })

			res.status(StatusCodes.OK).json({ user: tokenUser })
		}
	} catch (error) {
		res.status(400)

		throw new CustomError.UnauthenticatedError('Google Authentication failed')
	}
}

module.exports = {
	verifyEmail,
	register,
	login,
	logout,
	forgotPassword,
	resetPassword,
	verifyNumber,
	googleSignUser,
}
