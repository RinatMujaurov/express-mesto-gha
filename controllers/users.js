const User = require("../models/user");
const ValidationError = require("../errors/ValidationError");


module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((error) => next(error));
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Пользователь не найден");
        error.status = 404;
        throw error;
      }
      res.send({ data: user });
      next();
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new ValidationError("Некорректные данные пользователя", 400));
      }
      return next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return next(new ValidationError("Отсутствуют обязательные поля"));
  }

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new ValidationError("Некорректные данные пользователя"));
      }
      return next(error);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        const error = new Error("Пользователь не найден");
        error.status = 404;
        throw error;
      }
      res.send({ data: user });
      next();
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new ValidationError("Некорректные данные пользователя"));
      }
      return next(error);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        const error = new Error("Пользователь не найден");
        error.status = 404;
        throw error;
      }
      res.send({ data: user });
      next();
    })
    .catch(next);
};
