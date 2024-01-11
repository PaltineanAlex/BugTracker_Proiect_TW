const express = require('express');
const { resolve, join } = require('path');
const { json, urlencoded } = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');

const { initialize } = require('./bazadate');
const router = require('./router');
const PORT = process.env.PORT || 8080;

express()
  .use(cors({ 
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type, Authorization',
  }))
  .use(express.static(join(resolve('..'), 'client')))
  .use(urlencoded({ extended: true }))
  .use(json())
  .use('/api', router)
  .use(cookieParser())
  .listen(PORT, async () => {
    try {
      await initialize();
      console.log(`Server is running on port ${PORT}.`);
    } catch (error) {
      console.error(error);
    }
  });
