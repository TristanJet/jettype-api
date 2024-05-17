const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieparser = require('cookie-parser');

const routes = require('./api/routes');

const notFound = require('./api/middlewares/notfound');
const errorHandler = require('./api/middlewares/errorhandler');

const app = express();

app.use(morgan('dev'));

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  const whitelist = ['http://127.0.0.1:5174', 'http://192.168.16.1:5000'];
  const corsOptions = {
    origin(origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };

  app.use(cors(corsOptions));
} else {
  app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded());

app.use(cookieparser());

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
