const express = require('express')
const router = express.Router()
const {
	authenticateUser,
	authorizePermission,
} = require('../middleware/authentication')
const { register, login, logout } = require('../controllers/auth-controller')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(authenticateUser, logout)

module.exports = router
