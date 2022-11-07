const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const Category = require('../models/category-model')

const createCategory = async (req, res) => {
	let { category: _category, subCategory: _subCategory } = req.body

	_category = _category.toUpperCase()

	_subCategory = _subCategory.toUpperCase()

	const category = await Category.findOne({ category: _category })

	if (!category) {
		const newCategory = new Category({
			category: _category,
			subCategory: [_subCategory],
		})

		const createdCategory = await newCategory.save()

		res.status(201).json({ category: createdCategory })
	} else if (category.subCategory.includes(_subCategory)) res.json({ category })
	else {
		const updatedCategory = await Category.findOneAndUpdate(
			{ _id: category._id },
			{
				$push: { subCategory: _subCategory },
			},
			{ new: true }
		)
		res.status(201).json({ category: updatedCategory })
	}
}

const getAllCategory = async (req, res) => {
	const category = await Category.find({})
	res.status(StatusCodes.OK).json({ category })
}

const updateCategory = async (req, res) => {
	const categories = await Category.findOneAndUpdate(
		{ category: req.params.category },
		{ discount: req.body.discount },
		{ new: true }
	)
	if (!categories) return res.status(404).json({ msg: 'Category not found' })
	res.json(categories)
}

module.exports = {
	createCategory,
	getAllCategory,
	updateCategory,
}
