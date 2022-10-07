const express = require('express')
const router = express.Router()

const {
	createReview,
	updateReview,
	getAllReviews,
	getSingleReview,
	deleteReview,
} = require('../controllers/review-controller')
const {
	authenticateUser,
	authorizePermission,
} = require('../middleware/authentication')

router.route('/').get(getAllReviews).post(authenticateUser, createReview)
router
	.route('/:id')
	.get(getSingleReview)
	.patch(authenticateUser, updateReview)
	.delete(authenticateUser, deleteReview)

module.exports = router
