const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt')
const createTokenUser = require('./create-tokenUser')
const checkPermission = require('./check-permission')
const sendEmail = require('./sendEmail')
const sendVerificationEmail = require('./sendVerficationEmail')
const sendResetPassswordEmail = require('./sendResetPasswordEmail')
const createHash = require('./createHash')

module.exports = {
	createJWT,
	isTokenValid,
	attachCookiesToResponse,
	createTokenUser,
	checkPermission,
	sendEmail,
	sendVerificationEmail,
	sendResetPassswordEmail,
	createHash,
}
