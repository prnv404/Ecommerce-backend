const express = require('express')
const router = express.Router()

const {
	getAllUser,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
} = require('../controllers/user-controller')

const {
	authenticateUser,
	authorizePermission,
} = require('../middleware/authentication')

router
	.route('/')
	.get(authenticateUser, authorizePermission('admin'), getAllUser)
router.route('/showMe').get(authenticateUser, showCurrentUser)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)
router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/:id').get(authenticateUser, getSingleUser)

module.exports = router
