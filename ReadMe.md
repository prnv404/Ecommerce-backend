
# Ecommerce Backend

This is an ecommerce backend build with nodejs express and mongodb for database . Admin can create product and user can purchase it using online payment methods 
 like UPI , Netbanking , Credit/Debit card etc..
## Tech Stack


**Server:** Node, Express , Mongodb 


## Run Locally

Clone the project

```bash
  git clonehttps://github.com/prnv404/Edtech-backend.git
```

Go to the project directory

```bash
  cd Ecommerce-backend
```

Install dependencies

```bash
  npm install
```

Start the server in development mode

```bash
  npm run dev
```


## Features
 
1. Authentication

- Signup
- Login 
- Verify Email
- Verify Mobile Number
- Forget Password
- Reset Password
- Logout
- Google Authentication

2. user

- GetAllUser 
- GetSingleUser
- ShowCurrentUser
- UpdateUser
- UpdateUserPassword

3. Product 
- createProduct
- getAllProducts
- getSingleProduct
- updateProduct
- deleteProduct
- uploadImage

4. review 

- getAllReviews
- getSingleReview
- updateReview
- deleteReview
- createReview
- getSingleProductReview

5. Category 
- createCategory,
- getAllCategory,
- updateCategory,

6. Coupon 
- addCoupon,
- getAllCoupon,
- deleteCoupon,
- verifyCoupon,

7. Order 

- getAllOrders,
- getSingleOrder,
- getCurrentUserOrders,
- createOrder,
- updateOrder,

8. Payment 
- VerifyPayment
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

Mongodb

`MONGO_URI`

JWT 

`JWT_SECRET`

`JWT_LIFETIME`

Razorpay


`KEY_ID`

`KEY_SECRET`

`VERIFY_SECRET`

Twilio 


`ACCOUNT_SID`

`AUTH_TOKEN`

`SERVICE_ID`

Cloudinary 


`CLOUDINARY_API_KEY`

`CLOUDINARY_SECRET`

`CLOUDINARY_NAME`

Google Oauth

`GOOGLE_CLIENT_ID`
## Build With


- [bcryptjs](https://www.npmjs.com/package/bcrypt) - A library to help you hash passwords
- [cloudinary](https://cloudinary.com/) - cloud storage for photo/video
- [cookie-parser](https://www.npmjs.com/package/cookie-parser) -Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
- [cors](https://www.npmjs.com/package/cors) - CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- [dotenv](https://www.npmjs.com/package/dotenv) - Dotenv is a zero-dependency module that loads environment variables from a .env
- [express](https://expressjs.com/) - Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- [express-async-errors](https://www.npmjs.com/package/express-async-errors) - A dead simple ES6 async/await support hack for ExpressJS
- [express-fileupload](https://www.npmjs.com/package/express-fileupload) - Simple express middleware for uploading files.
- [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize) -Express 4.x middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection. 
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) - Basic rate-limiting middleware for Express
- [google-auth-library](https://www.npmjs.com/package/google-auth-library) - This is Google's officially supported node.js client library for using OAuth 2.0 authorization and authentication with Google APIs
- [helmet](https://www.npmjs.com/package/helmet) - Helmet helps you secure your Express apps by setting various HTTP headers
- [http-status-codes](https://www.npmjs.com/package/http-status-codes) - Constants enumerating the HTTP status codes
- [jsonwebtoken](https://jwt.io/) - JSON Web Token is a proposed Internet standard for creating data with optional signature and/or optional encryption 
- [mongoose](https://mongoosejs.com/) - elegant mongodb object modeling for node.js
- [morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware for node.js
- [nodemailer](https://nodemailer.com/about/) -Nodemailer is a module for Node.js applications to allow easy as cake email sending.  
- [razorpay](https://razorpay.com/) - Razorpay is the only payments solution in India that allows businesses to accept, process and disburse payments with its product suite
- [twilio](https://www.twilio.com/) - Twilio Used for verify Mobile Number throght OTP verification
- [validator](https://www.npmjs.com/package/validator) - This library validates and sanitizes strings only.
- [xss-clean](https://www.npmjs.com/package/xss-clean) - Node.js Connect middleware to sanitize user input coming from POST body, GET queries, and url params.
- [eslint](https://eslint.org/) - ESLint statically analyzes your code to quickly find problems. It is built into most text editors and you can run ESLint as part of your continuous integration pipeline.
- [nodemon](https://www.npmjs.com/package/nodemon) - nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.


## Authors

- [@prnv404](https://www.github.com/prnv404) -


## Contributing

Contributions are always welcome!




## License

[MIT](https://choosealicense.com/licenses/mit/)


## Future Updations

- Cart service

- Admin Dashboard with all sales report




## Feedback

If you have any feedback, please reach out to me at pranavofficial404@gmail.com

