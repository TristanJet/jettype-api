const qcontroller = async (req, res, next) => {
  try {
    res.json({
      content: {
        quote: process.env.QUOTE
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = qcontroller;
