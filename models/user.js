const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const userSchema = Schema({
    // name: {
    //     type: String,
    //     required: true
    // },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, { timestamps: true });

module.exports = model('User', userSchema);