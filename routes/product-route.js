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
} = require('../controllers/product-controller')

router
	.route('/')
	.get(getAllProducts)
	.post(authenticateUser, authorizePermission('admin'), createProduct)
router
	.route('/:id')
	.patch(authenticateUser, authorizePermission('admin'), updateProduct)
	.get(getSingleProduct)
	.delete(authenticateUser, authorizePermission('admin'), deleteProduct)
router
	.route('/uploadImage')
	.post(authenticateUser, authorizePermission('admin'), uploadImage)

module.exports = router
