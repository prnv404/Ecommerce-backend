const mongoose = require('mongoose')

const TokenSchema = mongoose.Schema({
	refreshToken: {
		type: String,
		required: true,
	},
	ip: {
		type: String,
		required: true,
	},
	userAgent: {
		type: String,
		required: true,
	},
	isValid: {
		type: Boolean,
		default: true,
	},
})
