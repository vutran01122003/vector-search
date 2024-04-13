const router = require('express').Router();
const chatControllers = require('../../controllers/chatControllers');

router.post('/chat', chatControllers.sendQuestion);

module.exports = router;
