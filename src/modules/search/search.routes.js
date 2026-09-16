const express = require('express');
const { universalSearch } = require('./search.controller');

const router = express.Router();

router.get('/', universalSearch);

module.exports = router;
