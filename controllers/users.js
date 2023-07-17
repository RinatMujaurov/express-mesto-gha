const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

// module.exports.login = (req, res, next) => {
//   const { email, password } = req.body;

//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });

//       // Установить куку с токеном
//       res.cookie('token', token, { httpOnly: true, secure: true });

//       // Отправить ответ с сообщением
//       res.send({ message: 'Авторизация прошла успешно' });
//     })
//     .catch((error) => next(error));
// };

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secretKey', { expiresIn: '7d' });

      // Отправить ответ с токеном в теле
      res.send({ token });
    })
    .catch((error) => next(error));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return next(new ValidationError('Отсутствуют обязательные поля'));
  }
  User.findOne({ email }) // Проверка наличия пользователя с таким же email
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError('Email уже существует');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      // Исключаем поле password из ответа
      const { password, ...userData } = user.toObject();
      res.status(201).send({ data: userData });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Некорректные данные пользователя'));
      }
      return next(error);
    });
};


module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .select('-password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new ValidationError('Некорректные данные пользователя', 400));
      }
      next(error);
    });
};




module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Некорректные данные пользователя', 400));
      }
      next(error);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Некорректные данные пользователя', 400));
      }
      next(error);
    });
};
