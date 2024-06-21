const errorHandler = (err, req, res, next) => {
   
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
  if (statusCode === 500) {
    console.log(`Server error: ${err}`);
  } else {
    console.log(`Client error: ${err.message}`);
  }
};

module.exports = errorHandler;
