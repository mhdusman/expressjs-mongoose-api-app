const { validationResult } = require('express-validator');

let validationResultSingltion;

exports.getValidationResult = (req) => {
    if (!validationResultSingltion)
        return validationResultSingltion = validationResult(req);
    else {
        return validationResultSingltion;
    }
};

exports.resetValidationResult = () => {
    validationResultSingltion = undefined;
};