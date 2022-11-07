const express = require('express')

const router = express.Router()

const {
	authenticateUser,
	authorizePermission,
} = require('../middleware/authentication')

const {
	createCategory,
	getAllCategory,
	updateCategory,
} = require('../controllers')

router
	.route('/')
	.post(authenticateUser, authorizePermission('admin'), createCategory)
	.get(authenticateUser, authorizePermission('admin'), getAllCategory)
router
	.route('/:id')
	.patch(authenticateUser, authorizePermission('admin'), updateCategory)

module.exports = router
