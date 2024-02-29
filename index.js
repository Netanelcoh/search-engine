const express = require('express');
const app = express();
const ErrorHandler = require('./apps/crawler/domain/errorHandler');

//require("./apps/crawler/data-access/redis")();
require("./apps/crawler/entry-points/routes/crawler")(app);
require("./apps/crawler/entry-points/api/crawler");

const errorHandler = new ErrorHandler();

process.on('uncaughtException', error => {
    errorHandler.handleError(error);
    process.exit(1);
  });
  

  process.on('unhandledRejection', (reason, promise) => {
    errorHandler.handleError(reason);
  });

const PORT = process.env.port || 3000;
app.listen(PORT, () => { console.log(`server is listening on port ${PORT}`)});

// const axios = require('axios');

// axios.get('https://www.ynet.co.il')
// .then(response => console.log(response.data))
// .catch(e => console.log(e))