const Card = require("../models/card");
const ValidationError = require("../errors/ValidationError");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new ValidationError("Некорректные данные карточки"));
      }
      return next(error);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        const error = new Error("Карточка не найдена");
        error.status = 404;
        throw error;
      }
      Card.findByIdAndRemove(cardId)
        .then((user) => {
          res.send({ data: user });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') { return next(new ValidationError('Error Data')); }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
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

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
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
