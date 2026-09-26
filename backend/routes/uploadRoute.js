const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controller/uploadController');
const authUser = require('../middleware/authUser');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/uploadimage', authUser, upload.single('image'), uploadImage);

module.exports = router;
