const {
	register,
	login,
	logout,
	verifyEmail,
	forgotPassword,
	resetPassword,
} = require('./auth-controller')
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
	forgotPassword,
	resetPassword,
	getSingleOrder,
	getCurrentUserOrders,
	getAllOrders,
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
	register,
	login,
	logout,
	verifyEmail,
}
