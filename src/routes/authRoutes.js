// const express = require('express');
// const { loginUser } = require('../controllers/authController');
// const router = express.Router();

// // Add a middleware to validate the request body (optional)
// const validateLogin = (req, res, next) => {
//   const { email, password } = req.body;

//   // Check if email and password are provided
//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required' });
//   }

//   next(); // Proceed to the login handler if validation passes
// };

// router.post('/login', validateLogin, loginUser);

// module.exports = router;
