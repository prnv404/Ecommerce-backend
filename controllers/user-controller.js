const User = require('../models/user-model')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const getAllUser = async (req, res) => {
	const users = await User.find({ role: 'user' }).select('-password')
	res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res) => {
	const user = await User.findOne({ _id: req.params.id }).select('-password')
	if (!user) {
		throw new CustomError.NotFoundError('NO user found')
	}
	res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
	res.send('hello from getallusr')
}
const updateUser = async (req, res) => {
	res.send('hello from getallusr')
}
const updateUserPassword = async (req, res) => {
	res.send('hello from getallusr')
}

module.exports = {
	getAllUser,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
}
