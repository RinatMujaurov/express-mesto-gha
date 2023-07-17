const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const ValidationError = require('../errors/ValidationError');

const urlValidation = (url) => {
  if (isUrl(url)) {
    return url;
  }
  throw new ValidationError('Некорректный URL');
};

module.exports.createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(urlValidation),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.updateProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(urlValidation),
  }),
});

module.exports.userIdValidation = celebrate({
  body: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

module.exports.createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(urlValidation),
  }),
});

module.exports.cardIdValidation = celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});
