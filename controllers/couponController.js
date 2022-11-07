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
    
}

const verifyCoupon = async (req, res) => {}

module.exports = {
	addCoupon,
	getAllCoupon,
	deleteCoupon,
	verifyCoupon,
}
