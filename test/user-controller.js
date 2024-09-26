const { expect } = require('chai');
const UserController = require('../controllers/user');
const sinon = require("sinon");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getValidationResult, resetValidationResult } = require('../util/global_var');

const User = require('../models/user');

//using sinon, chai, mocha
describe('User Controller Testing', () => {

    it('User signin, getting error', () => {
        const req = {
            body: { email: 'usman@gmail.com', password: '33' }
        };
        const validationResultObj = getValidationResult(req);
        sinon.stub(validationResultObj, "array").callsFake(function fakeFn() {
            return [{ msg: 'There is some error.' }]
        });
        sinon.stub(validationResultObj, "isEmpty");
        validationResultObj.isEmpty.returns(false);

        UserController.signIn(req, {}, () => { })
        expect(req.errObj.message).to.equal('There is some error.');
        validationResultObj.array.restore();
        validationResultObj.isEmpty.restore();
        resetValidationResult();
    })

    it('User signin successfully.', (done) => {
        const req = {
            body: { email: 'usman@gmail.com', password: '33' }
        };
        const res = {
            myObj: {},
            status: function (status) { return this },
            json: function (obj) { this.myObj = obj }
        };
        const validationResultObj = getValidationResult(req);
        sinon.stub(validationResultObj, "isEmpty");
        validationResultObj.isEmpty.returns(true);

        const userData = { _id: 989, email: 'usman@gmail.com' };
        var mockFindOne = {
            populate: function () {
                return Promise.resolve(userData);
            },
            // equals: function () {
            //     return this;
            // },
        };
        sinon.stub(User, "findOne").returns(mockFindOne);

        sinon.stub(jwt, "sign").callsFake(function fakeFn(obj, secret) {
            return 'myToken';
        });

        UserController.signIn(req, res, () => { }).then(() => {
            // console.log('res.myObj___', res.myObj);
            expect(res.myObj).to.deep.equal({ message: 'successfully login', token: 'myToken', user: userData });
            User.findOne.restore();
            jwt.sign.restore();
            resetValidationResult();
            done();
        })
    })

    it('User SignUp, Form validation error.', () => {
        const req = {
            body: { email: 'usman@gmail.com', password: '33', confirm_password: '33' }
        };
        const validationResultObj = getValidationResult(req);
        sinon.stub(validationResultObj, "array").callsFake(function fakeFn() {
            return [{ msg: 'There is some error.' }]
        });
        sinon.stub(validationResultObj, "isEmpty");
        validationResultObj.isEmpty.returns(false);

        UserController.signUp(req, {}, () => { })
        expect(req.errObj.message).to.equal('There is some error.');
        validationResultObj.array.restore();
        validationResultObj.isEmpty.restore();
        resetValidationResult();
    })

    it('User signup successfully.', (done) => {
        const req = {
            body: { email: 'usman@gmail.com', password: '33', confirm_password: '33' }
        };
        const res = {
            myObj: {},
            status: function (status) { return this },
            json: function (obj) { this.myObj = obj }
        };
        const validationResultObj = getValidationResult(req);
        sinon.stub(validationResultObj, "isEmpty");
        validationResultObj.isEmpty.returns(true);

        sinon.stub(User, "findOne").returns(Promise.resolve(null));
        // sinon.stub(User, "findOne").callsFake(function fakeFn(user) {
        //     return Promise.resolve(null);
        // });

        // const userObj = new User({ email: 'd', password: 's' });
        // sinon.stub(userObj, "save");
        sinon.stub(User, "create").withArgs({ email: 'us@gmail.com', password: 'hash-password' });

        sinon.stub(bcrypt, "hash").callsFake(function fakeFn(password, no) {
            return Promise.resolve('hash-password');
        });
        // sinon.stub(bcrypt, "hash").returns(Promise.resolve('hash-password'));

        UserController.signUp(req, res, () => { }).then(() => {
            // console.log('res.myObj___', res.myObj);
            expect(res.myObj).to.deep.equal({ message: 'User is signup successfully.' });
            User.findOne.restore();
            // userObj.save.restore();
            User.create.restore();
            bcrypt.hash.restore();
            resetValidationResult();
            done();
        })
    })

    it('User signup, user already exist.', (done) => {
        const req = {
            body: { email: 'usman@gmail.com', password: '33', confirm_password: '33' }
        };
        const validationResultObj = getValidationResult(req);
        sinon.stub(validationResultObj, "isEmpty");
        validationResultObj.isEmpty.returns(true);

        sinon.stub(User, "findOne").returns(Promise.resolve({ email: 'us@gmail.com' }));

        UserController.signUp(req, {}, () => { }).then(() => {
            expect(req.errObj).to.have.property('message', 'This user already exist.');
            expect(req.errObj).to.have.property('errorCode', 500);
            User.findOne.restore();
            validationResultObj.isEmpty.restore();
            resetValidationResult();
            done();
        })
    })


});