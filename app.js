const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const ValidationError = require('./errors/ValidationError');
const helmet = require('helmet');


const {
  MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb',
  PORT = 3000,
} = process.env;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const app = express();

app.use(bodyParser.json())

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '64a03074de65a1df35cb4077' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(routes);

// Обработчик 404 - несуществующий путь
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Обработчик ошибок
app.use((error, req, res, next) => {
  let status = error.status || 500;
  let message = error.message || 'На сервере произошла ошибка';

  if (error instanceof ValidationError) {
    status = 400;
    message = error.message;
  }

  res.status(status).send({ message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});