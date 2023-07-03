const User = require("../models/user");

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
      res.send(user);
    })
    .catch((error) => next(error));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((error) => next(error));
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
    .catch(next);
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
