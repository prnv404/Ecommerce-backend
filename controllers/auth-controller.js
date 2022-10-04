const User = require('../models/user-model')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { createJWT } = require('../utils')

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
  const token = createJWT({ payload: tokenUser })

  res.json(StatusCodes.CREATED, { tokenUser, token })
  // res.status(StatusCodes.CREATED).json(tokenUser, token)
}
const login = async (req, res) => {
  res.send('Hello from Login')
}
const logout = async (req, res) => {
  res.send('Hello from Logout')
}

module.exports = {
  register,
  login,
  logout,
}
