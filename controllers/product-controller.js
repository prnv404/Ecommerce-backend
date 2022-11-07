const { StatusCodes } = require('http-status-codes')
const path = require('path')
const Product = require('../models/product-model')
const CustomError = require('../errors')
const upload = require('./cloudinary')

/**
 * It creates a new product and returns it
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 */
const createProduct = async (req, res) => {
	req.body.user = req.user.userId
	const product = await Product.create(req.body)
	res.status(StatusCodes.CREATED).json(product)
}

/**
 * It gets all the products from the database and sends them back to the client
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 */

const getAllProducts = async (req, res) => {
	const products = await Product.find({})
	res.status(StatusCodes.OK).json({ products, count: products.length })
}

const getSingleProduct = async (req, res) => {
	const { id: productId } = req.params

	const product = await Product.findOne({ _id: productId }).populate('reviews')
	if (!product) {
		throw new CustomError.NotFoundError('No product find ')
	}
	res.status(StatusCodes.OK).json(product)
}
/**
 * It finds a product by its id, updates it with the data in the request body, and returns the updated
 * product
 * @param req - The request object.
 * @param res - The response object.
 */

const updateProduct = async (req, res) => {
	const { id: productId } = req.params
	const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
		new: true,
		runValidators: true,
	})
	if (!product) {
		throw new CustomError.NotFoundError('No product find ')
	}
	res.status(StatusCodes.OK).json(product)
}

/**
 * It finds a product by its id, and if it exists, it removes it
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 */
const deleteProduct = async (req, res) => {
	const { id: productId } = req.params
	const product = await Product.findOne({ _id: productId })
	if (!product) {
		throw new CustomError.NotFoundError('No product find ')
	}
	await product.remove()
	res.status(StatusCodes.OK).json({ msg: 'product removed' })
}

/**
 * It uploads an image to Cloudinary and returns the public_id and url of the uploaded image
 * @param req - The request object.
 * @param res - The response object.
 */
const uploadImage = async (req, res) => {
	if (!req.files) {
		throw new CustomError.BadRequestError('Please provide image')
	}

	const productImage = req.files.image
	if (!productImage.mimetype.startsWith('image')) {
		throw new CustomError.BadRequestError('Please provide image')
	}
	const maxSize = 1024 * 1024
	if (productImage.size > maxSize) {
		throw new CustomError.BadRequestError('Please provide image less than 1 mb')
	}
	const imagePath = path.join(
		__dirname,
		// eslint-disable-next-line no-useless-concat
		'../public/uploads/' + `${productImage.name}`
	)
	await productImage.mv(imagePath)
	const result = await upload(imagePath)

	res
		.status(StatusCodes.OK)
		.json({ public_id: result.public_id, url: result.secure_url })
}

module.exports = {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadImage,
}
