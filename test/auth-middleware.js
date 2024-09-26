const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const isAuth = require('../middleware/is-auth');
const sinon = require("sinon");

//using sinon, chai, mocha
describe('Auth Middleware Testing', () => {

    it('Token is missing.', () => {
        const req = {
            get: function (param) {
                return null;
            }
        };
        expect(isAuth.bind(this, req, {}, () => { })).to.throw('Token is required.')
    })

    it('Invalid token.', () => {
        const req = {
            get: function (param) {
                return 'abc';
            }
        };
        sinon.stub(jwt, "verify").callsFake(function fakeFn(token, secret, cb) {
            cb(new Error('Invalid token.', undefined));
        });
        isAuth(req, {}, () => { })
        expect(req.errObj.message).to.equal('Invalid token.');
        jwt.verify.restore();
    })

    it('With valid jwt token, get user data.', () => {
        const req = {
            get: function (dd) {
                return 'Bearer abc';
            }
        };
        sinon.stub(jwt, "verify").callsFake(function fakeFn(token, secret, cb) {
            cb(undefined, { data: { _id: 6 } });
        });
        isAuth(req, {}, () => { })
        expect(req).to.property('userId');
        expect(req).to.property('userId', 6);
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    })
});