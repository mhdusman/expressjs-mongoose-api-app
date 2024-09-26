const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.get('Authorization')) {
        const token = req.get('Authorization').split(' ')[1];
        jwt.verify(token, 'secret', function (err, decodeUserObj) {
            // console.log(decodeUserObj);
            if (err || !decodeUserObj) {
                req.errObj = err || new Error('Invalid Toeken.');
                req.errObj.errorCode = 401;
                return next(req.errObj);
            }
            req.userId = decodeUserObj.data._id;
            next();
        });
    } else {
        req.errObj = new Error('Token is required.');
        req.errObj.errorCode = 401;
        throw req.errObj;
        // next(errObj);
    }
}