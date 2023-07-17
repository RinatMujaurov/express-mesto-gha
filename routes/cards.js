const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { createCardValidation, cardIdValidation } = require('../middlewares/validation');

cardsRouter.post('/', createCardValidation, createCard);
cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId', cardIdValidation, deleteCard);
cardsRouter.put('/:cardId/likes', cardIdValidation, likeCard);
cardsRouter.delete('/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = cardsRouter;
