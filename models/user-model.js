const mongoose = require('mongoose')
const validator = require('validator')
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

module.exports = mongoose.model('User', userSchema)
