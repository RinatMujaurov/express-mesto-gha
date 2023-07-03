const Card = require("../models/card");
const ValidationError = require("../errors/ValidationError");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new ValidationError("Некорректные данные карточки"));
      }
      return next(error);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
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
