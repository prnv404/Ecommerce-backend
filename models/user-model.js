const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide name'],
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: 'Please provide valid email',
		},
	},
	mobNumber: {
		type: String,
		validate: {
			validator: validator.isMobilePhone,
		},
		maxlength: 10,
		minlength: 10,
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please provide password'],
		minlength: 6,
	},
	role: {
		type: String,
		enum: ['admin', 'user'],
		default: 'user',
	},
	verificationToken: String,
	isVerified: {
		type: Boolean,
		default: false,
	},
	verified: Date,
	passwordToken: {
		type: String,
	},
	passwordTokenExpirationDate: {
		type: Date,
	},
})

UserSchema.pre('save', async function () {
	if (!this.isModified('password')) return
	const genSalt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, genSalt)
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password)
	return isMatch
}

module.exports = mongoose.model('User', UserSchema)
