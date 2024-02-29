const express = require('express');
const crawler = require("../api/crawler");
const ErrorHandler = require('../../domain/errorHandler');
const errorHandler = new ErrorHandler();

module.exports = function(app) {
    app.use(express.json());
    app.use('/crawl', crawler);
    app.use(async (err, req, res, next) => {
      await errorHandler.handleError(err, res);
      });
}
