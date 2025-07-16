const express = require('express');
const router = express.Router();
const { handleLinkedInAuth } = require('../services/authService');

router.post('/auth/linkedin/token', handleLinkedInAuth);

module.exports = router;
