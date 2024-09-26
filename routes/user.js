const express = require('express');
const { signIn, signUp, verifyToken } = require('../controllers/user');
const { signUpValidate, signInValidate } = require('../validate/user-validate');

const router = express.Router();

router.post('/signup', signUpValidate(), signUp);
router.post('/signin', signInValidate(), signIn);
router.post('/verify-token', verifyToken);

module.exports = router;