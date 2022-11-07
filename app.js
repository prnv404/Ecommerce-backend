require('dotenv').config()
require('express-async-errors')

const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')

const app = express()

// DB
const connectDB = require('./db/connect')

// ERROR HANDLERS
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// ROUTES
const authRouter = require('./routes/auth-routes')
const userRouter = require('./routes/user-route')
const productRouter = require('./routes/product-route')
const reviewRouter = require('./routes/review-route')
const orderRouter = require('./routes/order-route')
const categoryRouter = require('./routes/category-router')
const couponRouter = require('./routes/coupon-route')

const verifyPayment = require('./controllers')
// MIDDLEWARES

app.set('trust proxy', 1)
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 60,
	})
)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload())
app.use(morgan('dev'))

app.use(express.static('./public'))
app.get('/', (req, res) => {
	res.send('Ecommerce-api')
})
app.get('/api/v1', (req, res) => {
	console.log(req.signedCookies)
	res.send('Ecommerce-api')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/category', categoryRouter)
app.use('api/v1/coupon', categoryRouter)

app.post('/api/v1/verify-payment', verifyPayment)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI)
		app.listen(port, () => {})
		console.log(`server is 🏃 on port ${port}`)
	} catch (error) {
		console.log(error)
	}
}
start()
