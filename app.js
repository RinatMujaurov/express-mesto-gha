const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const bodyParser = require('body-parser');

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

app.use((req, res, next) => {
  req.user = {
    _id: '64a03074de65a1df35cb4077' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(routes);

app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});