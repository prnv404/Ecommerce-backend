const mongoose = require('mongoose')

const singleCartItemSchema = mongoose.Schema({
	name: { type: String, required: true },
	image: { type: String, required: true },
	price: { type: Number, required: true },
	amount: { type: Number, required: true },
	product: {
		type: mongoose.Schema.ObjectId,
		ref: 'Product',
		required: true,
	},
})

const OrderSchema = mongoose.Schema(
	{
		tax: {
			type: Number,
			required: true,
		},
		shippingFee: {
			type: Number,
			required: true,
		},
		subtotal: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		cartItem: [singleCartItemSchema],

		status: {
			type: String,
			enum: ['pending', 'cancelled', 'paid', 'deliverd', 'failed'],
			default: 'pending',
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		clientSecret: {
			type: String,
			required: true,
		},
		paymentIntentId: {
			type: String,
		},
	},
	{ timeStamps: true }
)

module.exports = mongoose.model('Order', OrderSchema)
