const express = require('express')

const router = express.Router()

const {
	getAllOrders,
	getCurrentUserOrders,
	getSingleOrder,
	createOrder,
	updateOrder,
} = require('../controllers')
const {
	authenticateUser,
	authorizePermission,
} = require('../middleware/authentication')

router
	.route('/')
	.get(authenticateUser, authorizePermission('admin'), getAllOrders)
	.post(authenticateUser, createOrder)

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)

router
	.route('/:id')
	.get(authenticateUser, getSingleOrder)
	.patch(authenticateUser, updateOrder)

module.exports = router
