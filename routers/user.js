const router = require('express').Router();
const UserController = require('../controllers/UserController');
const { verifyToken, verifyTokenAndAdmin } = require('../controllers/MiddlewareControllers')


router.get('/', verifyToken, UserController.getUsers)
router.delete('/delete/:id', verifyTokenAndAdmin, UserController.deleteUser)

module.exports = router;