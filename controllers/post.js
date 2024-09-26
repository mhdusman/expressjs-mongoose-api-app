const { validationResult } = require('express-validator');
const fs = require('fs');
const Post = require("../models/post");
const User = require('../models/user');

exports.postList = (req, res, next) => {
    Post.find({}, '-__v').populate('user', 'email -_id').then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        err.errorCode = 500;
        next(err);
    })
}

exports.createPost = (req, res, next) => {
    const { title, description } = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty() && !req.fileError) {
        data = { title, description, user: req.userId };
        if (req.files && req.files['image']) {
            data['image'] = req.files['image'][0].path;
        }
        let Gpost;
        Post.create(data).then((post) => {
            Gpost = post;
            return User.findById(req.userId);
        }).then((user) => {
            user.posts.push(Gpost);
            user.save();
            res.status(201).json({ message: 'Post is created successfully.', post: Gpost })
        }).catch((err) => {
            err.errorCode = 500;
            next(err);
        })
    } else {
        const errObj = new Error('There is some error.');
        errObj.errorCode = 500;
        errObj.formError = [...errors.array(), ...(req.fileError) ? req.fileError : []];
        next(errObj);
    }
}

exports.editPost = (req, res, next) => {
    const postId = req.params.postId;
    const { title, description } = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty() && !req.fileError) {
        Post.findById(postId).populate('user', '-password').then((post) => {
            if (!post) {
                throw new Error('Post does not exist.');
            }
            post.title = title;
            post.description = description;
            if (req.files && req.files['image']) {
                fs.unlink(post.image, (err) => {
                    if (err) throw err;
                });
                post.image = req.files['image'][0].path;
            }
            post.save();
            res.status(200).json({ message: 'Post is updated successfully.', post });
        }).catch((err) => {
            err.errorCode = 500;
            next(err);
        })
    } else {
        const errObj = new Error('There is some error.');
        errObj.errorCode = 500;
        errObj.formError = [...errors.array(), ...(req.fileError) ? req.fileError : []];
        next(errObj);
    }
}