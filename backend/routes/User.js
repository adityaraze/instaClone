const express = require("express");
const { 
  register, 
  login, 
  logout, 
  getProfile, 
  editProfile, 
  followOrUnfollow, 
  getSuggestedUsers 
} = require("../controllers/User");  // Ensure correct path to User.js controller

const isAuthenticated = require('../middlewares/isAuthenticated.js');
// const upload = require('../middlewares/multer.js');  // Ensure multer is correctly configured

const router = express.Router();

// Define routes with appropriate middlewares and controllers
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/:id/profile', isAuthenticated, getProfile);

// Corrected the field name inside upload.single()
router.post('/profile/edit', isAuthenticated, editProfile);

router.get('/suggested', isAuthenticated, getSuggestedUsers);
router.post('/followorunfollow/:id', isAuthenticated, followOrUnfollow);

module.exports = router;