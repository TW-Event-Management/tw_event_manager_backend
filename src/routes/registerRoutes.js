const express = require('express');
const router =  express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser); 
router.post('/login', userController.loginUser); // TODO: Implement this
router.post('/verify-token', userController.verifyToken); // TODO Implement this

module.exports = router