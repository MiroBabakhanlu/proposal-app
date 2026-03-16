const { body, validationResult } = require('express-validator');

// for user registration
const validateUser = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail()
        .toLowerCase(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain at least one letter and one number'),

    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
        // .escape(),

    body('role')
        .optional()
        .isIn(['SPEAKER', 'REVIEWER', 'ADMIN']).withMessage('Invalid role'),
];

// for login validation
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail()
        .toLowerCase(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 1, max: 100 }).withMessage('Password length invalid'), 
];

// for proposal creation
const validateProposal = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
        // .escape(),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
        // .escape(),

    body('tags')
        .optional()
        // .isArray().withMessage('Tags must be an array')
        .custom((tags) => {
            if (tags) {
                for (let tag of tags) {
                    if (typeof tag !== 'string' || tag.length > 50) {
                        throw new Error('Each tag must be a string under 50 characters');
                    }
                }
            }
            return true;
        }),
];

// for review submission
const validateReview = [
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),

    body('comment')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
        // .escape(),
];

// for status update
const validateStatus = [
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['PENDING', 'APPROVED', 'REJECTED']).withMessage('Invalid status value'),
];





// Middleware to check validation results
const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Something went wrong',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

module.exports = {
    validateUser,
    validateLogin,
    validateProposal,
    validateReview,
    validateStatus,
    checkValidation
};