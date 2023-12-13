const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const routes = require('./api/routes')

const notFound = require('./api/middlewares/notfound');
const errorHandler = require('./api/middlewares/errorhandler')

const app = express();

app.use(morgan('dev'));

app.use(helmet());

app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);  

module.exports = app;
