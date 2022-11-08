const {
	register,
	login,
	logout,
	verifyEmail,
	forgotPassword,
	resetPassword,
	verifyNumber,
	googleSignUser,
} = require('./auth-controller')
const {
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
	createOrder,
	updateOrder,
} = require('./order-controller')
const {
	createCategory,
	getAllCategory,
	updateCategory,
} = require('./category-controller')
const {
	addCoupon,
	getAllCoupon,
	deleteCoupon,
	verifyCoupon,
} = require('./couponController')
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

const verifyPayment = require('./payment-controller')

module.exports = {
	googleSignUser,
	verifyNumber,
	verifyPayment,
	addCoupon,
	getAllCoupon,
	deleteCoupon,
	verifyCoupon,
	createCategory,
	getAllCategory,
	updateCategory,
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
