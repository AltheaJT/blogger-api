const { body } = require('express-validator');

// Validation rules for user sign-up
const validateSignUp = [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validation rules for user sign-in
const validateSignIn = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Validation rules for blog creation/update
const validateBlog = [
    body('title').notEmpty().withMessage('Title is required'),
    body('body').notEmpty().withMessage('Body is required'),
    body('state').optional().isIn(['draft', 'published']).withMessage('State must be either "draft" or "published"'),
];

module.exports = {
    validateSignUp,
    validateSignIn,
    validateBlog,
};