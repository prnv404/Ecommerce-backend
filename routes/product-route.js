const express = require('express')

const router = express.Router()
const {
	authenticateUser,
	authorizePermission,
} = require('../middleware/authentication')

const {
	getAllProducts,
	getSingleProduct,
	updateProduct,
	uploadImage,
	deleteProduct,
	createProduct,
} = require('../controllers')

const { getSingleProductReview } = require('../controllers')

router
	.route('/')
	.get(authenticateUser, getAllProducts)
	.post(authenticateUser, authorizePermission('admin'), createProduct)

router
	.route('/uploadImage')
	.post(authenticateUser, authorizePermission('admin'), uploadImage)
router
	.route('/:id')
	.patch(authenticateUser, authorizePermission('admin'), updateProduct)
	.get(getSingleProduct)
	.delete(authenticateUser, authorizePermission('admin'), deleteProduct)
router.route('/:id/reviews').get(getSingleProductReview)

module.exports = router
