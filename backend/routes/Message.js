const express = require("express");

const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated.js');
const { sendMessage, getMessage } = require("../controllers/Message.js");
router.post('/send/:id', isAuthenticated,sendMessage);
router.get('/all/:id', isAuthenticated,getMessage);

module.exports = router;