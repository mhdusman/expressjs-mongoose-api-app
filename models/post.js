const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String
    },
    user: {
        type: 'ObjectId',
        ref: 'User'
    }
}, { timestamps: true });

module.exports = model('Post', postSchema);