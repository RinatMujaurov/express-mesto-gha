const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('Пользователь не найден');
        error.status = 404;
        throw error;
      }
      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
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
        const error = new Error('Пользователь не найден');
        error.status = 404;
        throw error;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.status = 400;
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        const error = new Error('Пользователь не найден');
        error.status = 404;
        throw error;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.status = 400;
      }
      next(err);
    });
};


// const User = require('../models/user');

// module.exports.getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.send({ data: users }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// };

// module.exports.getUserById = (req, res) => {
//   const { userId } = req.params;

//   User.findById(userId)
//     .then((user) => res.send(user))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// };

// module.exports.createUser = (req, res) => {
//   const { name, about, avatar } = req.body;

//   User.create({ name, about, avatar })
//     .then((user) => res.send({ data: user }))
//     .catch((error) => {
//       console.error('Error creating user:', error);
//       res.status(500).send({ message: 'Произошла ошибка' });
//     });
// };

// module.exports.updateProfile = (req, res) => {
//   const userId = req.user._id;
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(
//     userId,
//     { name, about },
//     { new: true, runValidators: true }
//   )
//     .then((user) => {
//       if (!user) {
//         return res.status(404).send({ message: 'Пользователь не найден' });
//       }
//       return res.send({ data: user });
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         return res.status(400).send({ message: 'Переданы некорректные данные' });
//       }
//       return res.status(500).send({ message: 'Произошла ошибка' });
//     });
// };

// module.exports.updateAvatar = (req, res) => {
//   const userId = req.user._id;
//   const { avatar } = req.body;
//   User.findByIdAndUpdate(
//     userId,
//     { avatar },
//     { new: true, runValidators: true }
//   )
//     .then((user) => {
//       if (!user) {
//         return res.status(404).send({ message: 'Пользователь не найден' });
//       }
//       return res.send({ data: user });
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         return res.status(400).send({ message: 'Переданы некорректные данные' });
//       }
//       return res.status(500).send({ message: 'Произошла ошибка' });
//     });
// };