const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const Coupon = require('../models/category-model')

const addCoupon = async (req, res) => {
	const { coupon } = req.body

	if (!coupon) {
		throw new CustomError.BadRequestError('Please provide coupon')
	}

	const existingCoupon = await Coupon.findOne({ code: coupon.code })

	if (existingCoupon) {
		throw new CustomError.BadRequestError('Coupon already exist')
	}

	if (coupon) {
		const couponData = await Coupon.create(coupon)
		res.status(StatusCodes.CREATED).json(couponData)
	} else {
		res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid coupon' })
	}
}

const getAllCoupon = async (req, res) => {
	const coupons = await Coupon.find()
	res.status(StatusCodes.OK).json({
		data: coupons,
	})
}

const deleteCoupon = async (req, res) => {
	const coupon = await Coupon.findOne({ code: req.params.code })
	if (!coupon) {
		res.status(404).json({
			message: 'Coupon not found',
		})
	} else {
		await Coupon.deleteOne({ _id: coupon._id })
		res.status(200).json({
			message: 'Coupon deleted successfully',
		})
	}
}

const verifyCoupon = async (req, res) => {
	const coupon = await Coupon.findOne({ code: req.params.code })
	if (!coupon) {
		res.status(404).json({
			message: 'Coupon not found',
		})
	} else {
		res.status(200).json({
			coupon,
		})
	}
}

module.exports = {
	addCoupon,
	getAllCoupon,
	deleteCoupon,
	verifyCoupon,
}
