const express = require('express')

const router = express.Router()

const {
	authenticateUser,
	authorizePermission,
} = require('../middleware/authentication')

const {
	addCoupon,
	getAllCoupon,
	deleteCoupon,
	verifyCoupon,
} = require('../controllers')

router
	.route('/')
	.get(authenticateUser, getAllCoupon)
	.post(authenticateUser, authorizePermission('admin'), addCoupon)

router
	.route('/delete')
	.delete(authenticateUser, authorizePermission('admin'), deleteCoupon)

router.route('/verify-coupon').post(authenticateUser, verifyCoupon)

module.exports = router
