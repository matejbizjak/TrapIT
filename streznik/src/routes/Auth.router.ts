const express = require('express');
const router = express.Router();

const AuthController = require("../controller/AuthController");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
});
// define the home page route
router.post('/login', AuthController.login);

module.exports = router;