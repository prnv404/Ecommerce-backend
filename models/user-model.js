const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    requried: [true, 'A user must have a name'],
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    requierd: [true, 'A user must have a email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid Email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'A user must have password'],
    trim: true,
    minlength: 5,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
})

userSchema.pre('save', async function () {
  const genSalt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, genSalt)
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User', userSchema)
