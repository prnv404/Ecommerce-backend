const express = require('express')

const router = express.Router()
const {
	authenticateUser,
	authorizePermission,
} = require('../middleware/authentication')
const { register, login, verifyEmail, logout } = require('../controllers')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verifyEmail').post(verifyEmail)
router.route('/logout').get(authenticateUser, logout)

module.exports = router
