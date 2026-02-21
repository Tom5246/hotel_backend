const responseFormatter = (req, res, next) => {
  res.success = (data, message = 'success', code = 200) => {
    res.status(code).json({
      code,
      message,
      data
    });
  };

  res.error = (message, code = 400, errors = null) => {
    const response = {
      code,
      message
    };
    if (errors) {
      response.errors = errors;
    }
    res.status(code).json(response);
  };

  next();
};

module.exports = responseFormatter;