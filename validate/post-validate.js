const { body } = require('express-validator');

exports.postValidate = () => {
    return [
        body('title')
            .trim()
            .notEmpty().withMessage('Title field is required')
            .isString()
            .isLength({ min: 3 }).withMessage('Title field lenght would be more than 3.'),
        body('description')
            // .if(body('description').notEmpty())
            .if((value, { req }) => value)
            .isLength({ min: 3, max: 400 }).withMessage('Character would be more than 3.'),
        // body('user').notEmpty()
    ];
}
