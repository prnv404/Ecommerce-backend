require('dotenv').config()
require('express-async-errors')

const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const app = express()

// DB
const connectDB = require('./db/connect')

// ERROR HANDLERS
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// ROUTES

const authRouter = require('./routes/auth-routes')

// MIDDLEWARES

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Ecommerce-api')
})
app.get('/api/v1', (req, res) => {
  console.log(req.cookies)
  res.send('Ecommerce-api')
})

app.use('/api/v1/auth', authRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {})
    console.log(`server is spinning on port ${port}`)
  } catch (error) {
    console.log(error)
  }
}
start()
