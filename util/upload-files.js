const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|text\/plain|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Init upload
const imageUrlUpload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([{ name: 'image' }]);


exports.fileBodyParser = (req, res, next) => {
    imageUrlUpload(req, res, (err) => {
        if (err) {
            // next(err);
            req.fileError = [{ msg: err }];
            next();
        } else {
            if (!req.params.postId && (req.files == undefined || Object.keys(req.files).length === 0)) {
                // if (req.files == undefined) {
                // let errObj = new Error('No file selected!');
                // errObj.errorCode = 500;
                // next(errObj);
                req.fileError = [{ msg: 'No file selected!' }];
                next();
            } else {
                next();
            }
            // if (req.file == undefined) {
            //     res.render('index', { msg: 'No file selected!' });
            // }
            //  else {
            //     res.render('index', {
            //         msg: 'File uploaded!',
            //         file: `uploads/${req.file.filename}`
            //     });
            // }
        }
    })
}