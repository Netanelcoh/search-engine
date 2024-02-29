const express = require('express');
const {crawl}  = require('./crawlerController');
const router = express.Router();

router.post('/', crawl);


module.exports = router;