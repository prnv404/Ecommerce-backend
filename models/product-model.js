const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'Please provide name'],
			maxlength: [100, 'Name must  below 100 characters'],
		},
		price: {
			type: Number,
			required: [true, 'Please provide product price'],
			default: 0,
		},
		description: {
			type: String,
			required: [true, 'Please provide description'],
			maxlength: [1000, 'Description must  below 100 characters'],
		},
		image: {
			type: String,
			required: [true, ' please provide description'],
			default: '/uploads/example.jpeg',
		},
		category: {
			type: String,
			required: [true, 'Please provide category'],
		},
		company: {
			type: String,
			required: [true, 'Please provide company'],
		},
		color: {
			type: [String],
			default: ['#333'],
			required: true,
		},
		feature: {
			type: Boolean,
			default: false,
		},
		freeShipping: {
			type: Boolean,
			default: false,
		},
		inventory: {
			type: String,
			required: true,
			default: 15,
		},
		averageRating: {
			type: Number,
			default: 0,
		},
		numOfReviews: {
			type: Number,
			default: 0,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

ProductSchema.virtual('reviews', {
	ref: 'Review',
	localField: '_id',
	foreignField: 'product',
	justOne: false,
})

ProductSchema.pre('remove', async function (next) {
	await this.model('Review').deleteMany({ product: this._id })
})

module.exports = mongoose.model('Product', ProductSchema)
