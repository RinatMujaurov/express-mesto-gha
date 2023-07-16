const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'На сервере произошла ошибка';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Некорректный ID пользователя';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Некорректный токен авторизации';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Пользователь с таким email уже существует';
  }

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
