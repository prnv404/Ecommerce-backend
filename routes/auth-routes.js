const express = require('express')

const router = express.Router()

const { authenticateUser } = require('../middleware/authentication')

const {
	register,
	login,
	verifyEmail,
	logout,
	forgotPassword,
	resetPassword,
} = require('../controllers')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verifyEmail').post(verifyEmail)
router.route('/logout').delete(authenticateUser, logout)
router.route('/forget-password').post(forgotPassword)
router.route('/reset-password').post(resetPassword)

module.exports = router
