const express = require('express');
const { generateAIOutput } = require('../controllers/ai.controller');

const router = express.Router();

router.post('/generate', generateAIOutput);

module.exports = router;
