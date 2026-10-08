const express = require('express');
const { uploadFile, downloadFile, deleteFile } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', upload.single('file'), uploadFile);
router.get('/:id', downloadFile);
router.delete('/:id', deleteFile);

module.exports = router;