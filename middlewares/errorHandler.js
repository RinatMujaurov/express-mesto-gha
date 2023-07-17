
const errorHandler = (error, req, res, next) => {
  if (error.statusCode) {
    res.status(error.statusCode).send({ message: error.message });
  } else {
    res.status(500).send({ message: error.message || 'На сервере произошла ошибка.' });
  }
  next();
};

module.exports = errorHandler;
