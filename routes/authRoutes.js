const express = require('express');
const { signUpUser, signInUser } = require('../controllers/authController');
const { validateSignUp, validateSignIn } = require('../utils/validators'); // Import validators

const router = express.Router();

router.post('/signup', validateSignUp, signUpUser);
router.post('/signin', validateSignIn, signInUser);

module.exports = router;