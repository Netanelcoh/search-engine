const express = require('express');
const {crawl, checkStatus}  = require('./crawlerController');
const router = express.Router();

router.post('/', crawl);
router.get('/status/:id', checkStatus);


module.exports = router;