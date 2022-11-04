const { register, login, logout, verifyEmail } = require('./auth-controller')
const {
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
	createOrder,
	updateOrder,
} = require('./order-controller')

const {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadImage,
} = require('./product-controller')

const {
	getAllReviews,
	getSingleReview,
	updateReview,
	deleteReview,
	createReview,
	getSingleProductReview,
} = require('./review-controller')

const {
	getAllUser,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
} = require('./user-controller')

module.exports = {
	verifyEmail,
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
	createOrder,
	updateOrder,
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadImage,
	getAllUser,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
	getAllReviews,
	getSingleReview,
	updateReview,
	deleteReview,
	createReview,
	getSingleProductReview,
}
