const { StatusCodes } = require('http-status-codes')
const Razorpay = require('razorpay')
const crypto = require('crypto')
const Order = require('../models/order-model')

const instance = new Razorpay({
	key_id: process.env.KEY_ID,
	key_secret: process.env.KEY_SECRET,
})

const verifyPayment = async (req, res) => {
	const secret = process.env.VERIFY_SECRET

	console.log(req.body)

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		//    const user = await User.findOne()
	} else {
		// pass it
	}

	res.status(StatusCodes.OK)
}

module.exports = verifyPayment
