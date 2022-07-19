const router = require('express').Router();
const AuthControllers = require('../controllers/AuthControllers.js');

router.post('/register', AuthControllers.register);
router.post('/login', AuthControllers.login);
router.post('/refresh', AuthControllers.requestRefreshToken);

module.exports = router;