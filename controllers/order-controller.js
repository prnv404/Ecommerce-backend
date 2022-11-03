/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { StatusCodes } = require('http-status-codes')
const Order = require('../models/order-model')
const Product = require('../models/product-model')
const CustomError = require('../errors')
const { checkPermission } = require('../utils')

const fakeStripeAPI = async ({ amount, currency }) => {
	const client_secret = 'someFakeValue'
	return { client_secret, amount }
}

/**
 * It creates an order
 * @param req - The request object.
 * @param res - The response object.
 */
const createOrder = async (req, res) => {
	const { items: cartItems, tax, shippingFee } = req.body

	if (!cartItems || cartItems.length < 1) {
		throw new CustomError.BadRequestError('No cart items provided')
	}
	if (!tax || !shippingFee) {
		throw new CustomError.BadRequestError('Please provide tax and shipping fee')
	}

	let orderItems = []
	let subtotal = 0

	/* Looping through the cartItems and checking if the product exists in the database. If it does, it
	will add the product to the orderItems array. */
	for (const item of cartItems) {
		const dbProduct = await Product.findOne({ _id: item.product })
		if (!dbProduct) {
			throw new CustomError.NotFoundError(
				`No product with id : ${item.product}`
			)
		}
		const { name, price, image, _id } = dbProduct
		const singleOrderItem = {
			amount: item.amount,
			name,
			price,
			image,
			product: _id,
		}

		orderItems.push(singleOrderItem)

		subtotal += item.amount * price
	}

	const total = tax + shippingFee + subtotal

	const paymentIntent = await fakeStripeAPI({
		amount: total,
		currency: 'usd',
	})

	const order = await Order.create({
		cartItem: orderItems,
		total,
		subtotal,
		tax,
		shippingFee,
		clientSecret: paymentIntent.client_secret,
		user: req.user.userId,
	})

	res
		.status(StatusCodes.CREATED)
		.json({ order, clientSecret: order.clientSecret })
}
const getAllOrders = async (req, res) => {
	const orders = await Order.find({})
	res.status(StatusCodes.OK).json(orders)
}

const getSingleOrder = async (req, res) => {
	const { id: singleOrder } = req.params

	const order = await Order.findOne({ _id: singleOrder })
	if (!order.user === req.user.userId) {
		throw new CustomError.unauthorized('You have no access')
	}
	checkPermission(req.user.userId, order.user)
	res.status(StatusCodes.OK).json(order)
}
const getCurrentUserOrders = async (req, res) => {
	const orders = await Order.find({ user: req.user.userId })
	res.status(StatusCodes.OK).json(orders)
}

const updateOrder = async (req, res) => {
	const { id: orderId } = req.params
	const { paymentIntent } = req.body
	const order = await Order.findOne({ _id: orderId })
	if (!order) {
		throw new CustomError.NotFoundError('No order found')
	}
	checkPermission(req.user.userId, order.user)
	order.paymentIntent = paymentIntent
	order.status = 'paid'
	await order.save()
	res.status(StatusCodes.OK).json(order)
}

module.exports = {
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
	createOrder,
	updateOrder,
}
