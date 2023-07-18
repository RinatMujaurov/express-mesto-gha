require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const {
  createUserValidation,
  loginValidation,
} = require('./middlewares/validation');

const { MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb', PORT = 3000 } = process.env;

mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {

  });

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(helmet());

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);
app.use(routes);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {

});
