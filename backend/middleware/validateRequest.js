const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const items = errors.array().map(err => ({
    field: err.path || err.param || 'request',
    message: err.msg
  }));

  return res.status(400).json({
    message: items[0]?.message || 'Validation failed',
    errors: items
  });
};

module.exports = validateRequest;
