const { StatusCodes } = require('http-status-codes')
const Review = require('../models/review-model')
const Product = require('../models/product-model')
const CustomError = require('../errors')
const { checkPermission } = require('../utils')

const createReview = async (req, res) => {
	const { product: productId } = req.body
	req.body.user = req.user.userId

	const validProduct = await Product.findOne({ _id: productId })
	if (!validProduct) {
		throw new CustomError.NotFoundError('Product is not found')
	}

	const review = await Review.create(req.body)
	res.status(StatusCodes.CREATED).json(review)
}

const getAllReviews = async (req, res) => {
	const reviews = await Review.find({}).populate({
		path: 'product',
		select: 'name price company',
	})
	res.status(StatusCodes.OK).json(reviews)
}

const getSingleReview = async (req, res) => {
	const reviewId = req.params.id
	const review = await Review.findOne({ _id: reviewId })
	if (!review) {
		throw new CustomError.NotFoundError('No review found')
	}
	res.status(StatusCodes.OK).json(review)
}

const updateReview = async (req, res) => {
	const { id: reviewId } = req.params
	const { title, comment, rating } = req.body
	const review = await Review.findOne({ _id: reviewId })
	if (!review) {
		throw new CustomError.NotFoundError('No review found')
	}
	checkPermission(req.user.userId, review.user)
	review.comment = comment || review.comment
	review.title = title || review.title
	review.rating = rating || review.rating
	await review.save()

	res.status(StatusCodes.CREATED).json(review)
}
const deleteReview = async (req, res) => {
	const { id: reviewId } = req.params
	const review = await Review.findOne({ _id: reviewId })
	if (!review) {
		throw new CustomError.NotFoundError('No review')
	}
	checkPermission(req.user.userId, review.user)

	await review.remove()
	res.status(StatusCodes.OK).json({ msg: 'success' })
}

const getSingleProductReview = async (req, res) => {
	const { id: productId } = req.params
	const review = await Review.find({ product: productId })
	res.status(StatusCodes.OK).json(review)
}

module.exports = {
	getAllReviews,
	getSingleReview,
	updateReview,
	deleteReview,
	createReview,
	getSingleProductReview,
}
