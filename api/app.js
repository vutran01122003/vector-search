const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const createError = require('http-errors');
const compression = require('compression');
const Database = require('./dbs/init.database');

const app = express();
const instanceDB = Database.getInstance();
instanceDB.connect();

app.use(express.json(express.urlencoded({ extended: true })));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(helmet());
app.use(compression());

app.use('/api/v1', require('./routers/chat'));
app.use('/api/v1', require('./routers/file'));

app.use((req, res, next) => {
    next(createError(404, 'Not found'));
});

app.use((err, req, res, next) => {
    res.status(err.status).json({
        message: err.message
    });
});

module.exports = app;
