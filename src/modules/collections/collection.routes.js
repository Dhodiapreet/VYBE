
const express = require('express');
const { getCollections, createCollection } = require('./collection.controller');
const { protect } = require('../../middleware/auth.middleware');
const router = express.Router();
router.get('/', getCollections);
router.post('/', protect, createCollection);
module.exports = router;
