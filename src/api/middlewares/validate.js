const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body)
  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(errorMessage);
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;