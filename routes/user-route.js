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
router.route('/updateUser').patch(updateUser)
router.route('/updateUserPassword').patch(updateUserPassword)
router.route('/:id').get(getSingleUser)

module.exports = router
