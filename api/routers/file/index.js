const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fileControllers = require('../../controllers/fileControllers');

router.post('/file', upload.array('files', 10), fileControllers.uploadFile);

module.exports = router;
