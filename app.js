const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./models/post');
require('./models/user');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const app = express();

app.use('/uploads', express.static('uploads'));


var whitelist = ['https://cdpn.io', 'http://localhost:8080', undefined]
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}


app.use(cors(corsOptions));
app.use(bodyParser.json({ type: 'application/json' }));


app.use('/admin', postRouter);
app.use('/admin', userRouter);


app.use((error, req, res, next) => {
    const code = error.errorCode || 500;
    res.status(code).json({ message: error.message, formError: error.formError });
})


mongoose.connect("mongodb+srv://usmanqau77:8KPrzNVoh2C2m4p9@cluster0.qaeim.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0").then((data) => {
    // console.log('mongo connected...')
    app.listen(3000);
    // http.createServer(app)
}).catch(error => console.log('Error__', error));

module.exports = app;