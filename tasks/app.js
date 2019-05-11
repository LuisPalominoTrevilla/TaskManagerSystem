const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const formData = require('express-form-data');
const os = require('os');
const db = require('./db/connection');

const endpoints = require('./routes');

db.testConnection()
    .then(() => console.log('Succesfully connected to database'))
    .catch(err => console.log(err));

const app = express();

const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
};  

app.use(formData.parse(options));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

app.get('/healthecheck', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
app.use('/', endpoints);

module.exports = app;
