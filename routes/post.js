const express = require('express');
const { postList, createPost, editPost } = require('../controllers/post');
const { fileBodyParser } = require('../util/upload-files');
const { postValidate } = require('../validate/post-validate');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/list-post', isAuth, postList);
router.post('/create-post', isAuth, fileBodyParser, postValidate(), createPost);
router.post('/edit-post/:postId', isAuth, fileBodyParser, postValidate(), editPost);

module.exports = router;