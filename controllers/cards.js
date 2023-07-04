const mongoose = require('mongoose');
const Card = require("../models/card");
const ValidationError = require("../errors/ValidationError");
const { isValidObjectId } = mongoose;

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

  if (!isValidObjectId(cardId)) {
    const error = new Error('Некорректный ID карточки');
    error.status = 400;
    return next(error);
  }

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        const error = new Error('Карточка не найдена');
        error.status = 404;
        throw error;
      }

      res.send({ data: card });
      next();
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  if (!isValidObjectId(cardId)) {
    const error = new Error('Некорректный ID карточки');
    error.status = 400;
    return next(error);
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        const error = new Error("Карточка не найдена");
        error.status = 404;
        throw error;
      }
      res.send({ data: card });
      next();
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  if (!isValidObjectId(cardId)) {
    const error = new Error('Некорректный ID карточки');
    error.status = 400;
    return next(error);
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        const error = new Error("Карточка не найдена");
        error.status = 404;
        throw error;
      }
      res.send({ data: card });
      next();
    })
    .catch(next);
};
