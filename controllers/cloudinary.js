const cloudinary = require('cloudinary')

// config
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
})

// req.files.file.path
const upload = async (imagepath) => {
	try {
		let result = await cloudinary.uploader.upload(imagepath, {
			public_id: `${Date.now()}`,
			resource_type: 'auto', // jpeg, png
		})
	} catch (error) {
		console.log(error)
	}
}

module.exports = upload
