const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
  return token
}

const isTokenValid = ({ token }) => {
  const valid = jwt.verify(token, process.env.process.env.JWT_SECRET)
}

module.exports = {
  createJWT,
  isTokenValid,
}
