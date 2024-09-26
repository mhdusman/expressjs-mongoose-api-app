const { randomBytes } = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const { validationResult } = require('express-validator');
const { getValidationResult } = require('../util/global_var');

const User = require('../models/user');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "usman.code@gmail.com",
        pass: "uyquwuggkmbaqupn",
    },
});

const sendEmail = (email, subject, html) => {
    transporter.sendMail({
        from: "usman.code@gmail.com",
        to: email,
        subject: subject,
        html: html,
    }, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
}

exports.signUp = (req, res, next) => {
    const { email, password } = req.body;
    // const errors = validationResult(req);
    const errors = getValidationResult(req);
    if (errors.isEmpty()) {
        return User.findOne({ email: email }).then((user) => {
            if (!user) {
                bcrypt.hash(password, 12).then((pass) => {
                    // new User({ email, password: pass }).save();
                    User.create({ email, password: pass });
                }).then(() => {
                    // sendEmail('usman.qau77@gmail.com', 'successfully sign up', `You successfully sign up!`);
                    res.status(200).json({ message: 'User is signup successfully.' })
                });
            } else {
                throw new Error('This user already exist.');
            }
        }).catch((err) => {
            req.errObj = err;
            req.errObj.errorCode = 500;
            next(req.errObj);
        });
    } else {
        req.errObj = new Error('There is some error.');
        req.errObj.errorCode = 500;
        req.errObj.formError = errors.array();
        next(req.errObj);
    }
}

exports.signIn = (req, res, next) => {
    const { email } = req.body;
    const errors = getValidationResult(req);
    if (errors.isEmpty()) {
        return User.findOne({ email: email }, '-password -__v').populate('posts', '-user -__v').then((user) => {
            const token = jwt.sign({ data: { _id: user._id, email: user.email } }, 'secret');//, { expiresIn: '1h' }
            res.status(200).json({ message: 'successfully login', token, user });
        }).catch((errObj) => {
            errObj.errorCode = 500;
            next(errObj);
        });
    } else {
        req.errObj = new Error('There is some error.');
        req.errObj.errorCode = 500;
        req.errObj.formError = errors.array();
        next(req.errObj);
    }
}

exports.verifyToken = (req, res, next) => {
    const { token } = req.body;
    const decode = jwt.verify(token, 'secret');//, { expiresIn: '1h' }
    res.status(200).json({ message: 'successfully decoded', decode })
}