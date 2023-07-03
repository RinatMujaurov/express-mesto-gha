const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        const error = new Error('Карточка не найдена');
        error.status = 404;
        throw error;
      }
      return res.send({ data: card });
    })
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        const error = new Error('Карточка не найдена');
        error.status = 404;
        throw error;
      }
      return res.send({ data: card });
    })
    .catch((err) => next(err));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        const error = new Error('Карточка не найдена');
        error.status = 404;
        throw error;
      }
      return res.send({ data: card });
    })
    .catch((err) => next(err));
};


// const Card = require('../models/card');

// module.exports.getCards = (req, res) => {
//   Card.find({})
//     .then((cards) => res.send({ data: cards }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// };

// module.exports.createCard = (req, res) => {
//   const { name, link } = req.body;
//   Card.create({ name, link, owner: req.user._id })
//     .then((card) => res.send({ data: card }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// };

// module.exports.deleteCard = (req, res) => {
//   Card.findByIdAndRemove(req.params.cardId)
//     .then((card) => {
//       if (!card) {
//         return res.status(404).send({ message: 'Карточка не найдена' });
//       }
//       return res.send({ data: card });
//     })
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// };

// module.exports.likeCard = (req, res) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true }
//   )
//     .then((card) => {
//       if (!card) {
//         return res.status(404).send({ message: 'Карточка не найдена' });
//       }
//       return res.send({ data: card });
//     })
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// };

// module.exports.dislikeCard = (req, res) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true }
//   )
//     .then((card) => {
//       if (!card) {
//         return res.status(404).send({ message: 'Карточка не найдена' });
//       }
//       return res.send({ data: card });
//     })
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// };
