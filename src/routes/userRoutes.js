const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/get-all', userController.getUsers);

router.delete('/delete-user/:id', userController.deleteUser);

router.patch('/setWaiting/:id', userController.setWaiting);
router.patch('/setAdmin/:id', userController.setAdmin);

module.exports = router;