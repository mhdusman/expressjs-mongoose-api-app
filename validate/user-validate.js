const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.signInValidate = () => {
    return [
        body('email')
            .isEmail().withMessage('This is not email format.')
            .notEmpty().withMessage('Email field is required.'),
        body('password')
            .trim()
            .notEmpty().withMessage('Password field is required.')
            .custom(async (passVal, { req }) => {
                const { email } = req.body;
                // throw new Error('User does not exist.')
                return User.findOne({ email: email }).then((user) => {
                    if (!user) {
                        return Promise.reject('This email does not exist.');
                        // throw new Error('This email does not exist.');
                    }
                    return bcrypt.compare(passVal, user.password).then((match) => {
                        if (match) {
                        } else {
                            return Promise.reject('User does not exist.');
                            // throw new Error('User does not exist.');
                        }
                    });
                }).catch((err) => {
                    console.log(err);
                    return Promise.reject(err);
                });
            })
    ];
}

exports.signUpValidate = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage('This is not email format.')
            .notEmpty().withMessage('Email field is required.'),
        body('password')
            .trim()
            .notEmpty().withMessage('Password field is required.')
            .custom(async (passVal, { req }) => {
                const { email } = req.body;
                return User.findOne({ email: email }).then((user) => {
                    if (user) {
                        return Promise.reject('Email already exist.');
                    }
                }).catch((error) => {
                    console.log(error);
                    return Promise.reject(error);
                })
            }),
        body('confirm_password')
            .trim()
            .notEmpty().withMessage('Confirm password field is required.')
            .custom(async (confirm_password_val, { req }) => {
                const { password } = req.body;
                if (confirm_password_val !== password) {
                    throw new Error('Password have to match.');
                }
            })
    ];
}