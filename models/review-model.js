const mongoose = require('mongoose')
const ReviewSchema = mongoose.Schema(
	{
		rating: {
			type: Number,
			minlength: 1,
			maxlength: 5,
			required: [true, 'please provide rating'],
		},
		title: {
			type: String,
			required: [true, 'please provide title'],
			maxlength: 100,
		},
		comment: {
			type: String,
			required: [true, 'Please provide review text'],
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		product: {
			type: mongoose.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
	},
	{ timestamps: true }
)

ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

ReviewSchema.statics.calculateAverageRating = async function (productId) {
	console.log(productId)
}

ReviewSchema.post('save', async function (productId) {
	await this.constructor.calculateAverageRating(this.product)
})

ReviewSchema.post('remove', async function () {
	await this.constructor.calculateAverageRating(this.product)
})

module.exports = mongoose.model('Review', ReviewSchema)
