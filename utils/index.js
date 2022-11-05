const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt')
const createTokenUser = require('./create-tokenUser')
const checkPermission = require('./check-permission')
const sendEmail = require('./sendEmail')
const sendVerificationEmail = require('./sendVerficationEmail')

module.exports = {
	createJWT,
	isTokenValid,
	attachCookiesToResponse,
	createTokenUser,
	checkPermission,
	sendEmail,
	sendVerificationEmail,
}
