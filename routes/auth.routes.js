const { Router } = require('express');
const { check } = require('express-validator');
const { login, signUp } = require('../controllers/authController');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

// route for login
router.post('/login', [
    check('email')
        .isEmail().withMessage('the email is not valid')
        .notEmpty().withMessage('the email is required'),

    check('password')
        .isLength({ min: 6 }).withMessage('the password should be at least 6 characters long')
        .notEmpty().withMessage('the password is required'),

    validateFields
], login);

// route for sign up
router.post('/register', [
    check('name').notEmpty().withMessage('the name is required'),

    check('email')
        .notEmpty().withMessage('the email is required')
        .isEmail().withMessage('the email is not valid'),

    check('password')
        .isLength({ min: 6 }).withMessage('the password should be at least 6 characters long')
        .notEmpty().withMessage('the password is required'),

    validateFields
], signUp);

module.exports = router;