const usersRouter = require('express').Router();
const {
  getUsers, getUserById, updateProfile, updateAvatar, getUserInfo,
} = require('../controllers/users');
const { updateProfileValidation, updateAvatarValidation, userIdValidation } = require('../middlewares/validation');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', userIdValidation, getUserById);
usersRouter.get('/me', getUserInfo);
usersRouter.patch('/me', updateProfileValidation, updateProfile);
usersRouter.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = usersRouter;
