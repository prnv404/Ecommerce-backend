const { StatusCodes } = require('http-status-codes')
const User = require('../models/user-model')
const CustomError = require('../errors')
const {
	createTokenUser,
	attachCookiesToResponse,
	checkPermission,
} = require('../utils')
/**
 * It gets all the users from the database and sends them back to the client
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 */
const getAllUser = async (req, res) => {
	console.log(req.user)
	const users = await User.find({ role: 'user' }).select('-password')
	res.status(StatusCodes.OK).json({ users })
}

/**
 * It gets a single user from the database, and if the user is not found, it throws a custom error
 * @param req - The request object.
 * @param res - The response object.
 */

const getSingleUser = async (req, res) => {
	const user = await User.findOne({ _id: req.params.id }).select('-password')

	if (!user) {
		throw new CustomError.NotFoundError('NO user found')
	}

	checkPermission(req.user.userId, user._id)

	res.status(StatusCodes.OK).json({ user })
}
/**
 * It returns the current user
 * @param req - The request object.
 * @param res - The response object.
 */

const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user })
}
/**
 * It updates the user's password
 * @param req - The request object.
 * @param res - The response object.
 */

const updateUserPassword = async (req, res) => {
	const { newPassword, oldPassword } = req.body
	const { userId } = req.user

	if (!newPassword || !oldPassword) {
		throw new CustomError.BadRequestError('please provide all credentials')
	}

	const user = await User.findOne({ _id: userId })
	if (!user.comparePassword(oldPassword)) {
		throw new CustomError.UnauthenticatedError('Old password doesnt match')
	}
	user.password = newPassword
	await user.save()
	res.status(StatusCodes.OK).json({ msg: 'password updated successfully' })
}
/**
 * It updates the user's email and name, and then returns the updated user
 * @param req - The request object.
 * @param res - The response object
 */

const updateUser = async (req, res) => {
	const { email, name } = req.body
	if (!email || !name) {
		throw new CustomError.BadRequestError('Please provide all values')
	}

	const user = await User.findOne({ _id: req.user.userId })

	user.email = email
	user.name = name
	await user.save()
	const tokenUser = createTokenUser(user)
	attachCookiesToResponse({ res, user: tokenUser })
	res.status(StatusCodes.OK).json({ user: tokenUser })
}

module.exports = {
	getAllUser,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
}
